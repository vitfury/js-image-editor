/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview EraseDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import {drawingModes, componentNames as components} from '../consts';

/**
 * EraseDrawingMode class
 * @class
 * @ignore
 */
class EraseDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.ERASE);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @override
    */
    start(graphics, options) {
        const erase = graphics.getComponent(components.ERASE);
        erase.start(options);
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        var eraserElements = [];
        graphics._canvas._objects.forEach(function(item, key){
            if(item.globalCompositeOperation === 'destination-out') {
                eraserElements.push(item);
            }
        });
        var eraserGroup = new fabric.Group(eraserElements);

        // imageEditor.addObject(eraserGroup);
        graphics._canvas.add(eraserGroup);
        graphics._canvas.renderAll();

        //Remove erase elements from undo stack
        var undoStack = imageEditor._invoker._undoStack;
        undoStack.forEach(function(item, key){
            if(item.args[1].globalCompositeOperation) {
                var elementPosition = undoStack.indexOf(item);
                imageEditor._graphics._canvas.remove(item);
                undoStack.splice(elementPosition, 1);
            }
        });

        //Remove elements from canvas
        imageEditor._graphics._canvas.getObjects().forEach(function(item){
            if(item.globalCompositeOperation === 'destination-out') {
                imageEditor._graphics._canvas.remove(item);
            }
        })

        imageEditor.stickEraser(eraserGroup);

        const erase = graphics.getComponent(components.ERASE);
        erase.end();
    }
}

export default EraseDrawingMode;
