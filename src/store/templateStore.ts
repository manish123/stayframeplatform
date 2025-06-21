import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BaseTemplate, AnyCanvasElement, TextCanvasElement, CanvasDimensions } from '@/types/templates';
import cloneDeep from 'lodash/cloneDeep';

interface TemplateState {
  selectedTemplate: BaseTemplate | null;
  selectedElementId: string | null;
  selectedElement: AnyCanvasElement | null;
  isDevelopmentProModeActive: boolean;
  setSelectedTemplate: (template: BaseTemplate | null) => void;
  setSelectedElement: (element: AnyCanvasElement | null) => void;
  updateElementProperty: (elementId: string, propertyName: string, value: any) => void;
  deleteElement: (elementId: string) => void;
  setCanvasDimensions: (newDimensions: CanvasDimensions) => void;
  toggleDevelopmentProMode: () => void;
}

export const useTemplateStore = create<TemplateState>()(
  devtools(
    persist(
      (set) => ({
        selectedTemplate: null,
        selectedElementId: null,
        selectedElement: null,
        isDevelopmentProModeActive: false,

  setSelectedTemplate: (template) => set({
    selectedTemplate: template ? cloneDeep(template) : null,
    selectedElementId: null,
    selectedElement: null,
  }),

  setSelectedElement: (element) => set({
    selectedElement: element ? cloneDeep(element) : null,
    selectedElementId: element ? element.id : null,
  }),

  updateElementProperty: (elementId, propertyName, value) => {
    set((state) => {
      if (!state.selectedTemplate) return state;

      const updatedElements = state.selectedTemplate.elements.map((element: AnyCanvasElement) => {
        if (element.id === elementId) {
          let validatedValue = value;
          if (propertyName === 'opacity') {
            validatedValue = Math.max(0, Math.min(1, parseFloat(value) || 0));
          } else if (['x', 'y', 'width', 'height'].includes(propertyName)) {
            validatedValue = Math.max(0, parseFloat(value) || 0);
          } else if (propertyName === 'fontSize' && (element.type === 'text' || element.type === 'watermark')) {
            validatedValue = Math.max(1, parseFloat(value) || 16);
          } else if (propertyName === 'src' && (element.type === 'image' || element.type === 'video')) {
            validatedValue = typeof value === 'string' && value ? value : element.src;
          } else if (propertyName === 'rotation') {
            validatedValue = parseFloat(value) || 0;
          }
          return { ...element, [propertyName]: validatedValue };
        }
        return element;
      });

      const updatedTemplate = cloneDeep(state.selectedTemplate);
      updatedTemplate.elements = updatedElements as AnyCanvasElement[];

      const updatedSelectedElement = updatedElements.find((el: AnyCanvasElement) => el.id === elementId) || null;

      return {
        selectedTemplate: updatedTemplate,
        selectedElement: updatedSelectedElement,
        selectedElementId: updatedSelectedElement ? elementId : state.selectedElementId,
      };
    });
  },

  deleteElement: (elementId) => {
    set((state) => {
      if (!state.selectedTemplate) return state;

      const updatedElements = state.selectedTemplate.elements.filter(
        (el: AnyCanvasElement) => el.id !== elementId
      );

      const newSelectedElementId = state.selectedElementId === elementId ? null : state.selectedElementId;
      const newSelectedElement = state.selectedElement?.id === elementId ? null : state.selectedElement;

      return {
        selectedTemplate: {
          ...state.selectedTemplate,
          elements: updatedElements,
        },
        selectedElementId: newSelectedElementId,
        selectedElement: newSelectedElement,
      };
    });
  },

  setCanvasDimensions: (newDimensions) => {
    set((state) => {
      if (!state.selectedTemplate) return state;

      const oldDimensions = state.selectedTemplate.canvasDimensions;
      const scaleX = newDimensions.width / oldDimensions.width;
      const scaleY = newDimensions.height / oldDimensions.height;
      const contentScale = Math.min(scaleX, scaleY);

      const scaledElements = state.selectedTemplate.elements.map((element: AnyCanvasElement) => {
        const newElement = {
          ...element,
          x: element.x * scaleX,
          y: element.y * scaleY,
          width: element.width * scaleX,
          height: element.height * scaleY,
        };

        if (element.type === 'text' || element.type === 'watermark') {
          (newElement as TextCanvasElement).fontSize =
            ((newElement as TextCanvasElement).fontSize || 16) * contentScale;
        } else if (element.type === 'image' || element.type === 'video') {
          if (['contain', 'scale-down'].includes(element.objectFit || 'cover')) {
            const intrinsicAspectRatio = element.width / element.height;
            newElement.height = newElement.width / intrinsicAspectRatio;
          }
        }

        return newElement;
      });

      return {
        selectedTemplate: {
          ...state.selectedTemplate,
          canvasDimensions: newDimensions,
          elements: scaledElements as AnyCanvasElement[],
        },
      };
    });
  },

        toggleDevelopmentProMode: () =>
          set((state) => ({
            isDevelopmentProModeActive: !state.isDevelopmentProModeActive,
          })),
      }),
      {
        name: 'template-storage',
      }
    )
  )
);