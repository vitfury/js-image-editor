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
    start(graphics) {
        const erase = graphics.getComponent(components.ERASE);
        erase.start();
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const erase = graphics.getComponent(components.ERASE);
        erase.end();
    }
}

export default EraseDrawingMode;
