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
        imageEditor.stickEraser();
        const erase = graphics.getComponent(components.ERASE);
        erase.end();
    }
}

export default EraseDrawingMode;
