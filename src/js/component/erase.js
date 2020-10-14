/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Text module
 */
import fabric from 'fabric';
import Component from '../interface/component';
import {eventNames as events, componentNames} from '../consts';
import {Promise} from '../util';
import snippet from 'tui-code-snippet';


/**
 * Erase
 * @class Erase
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class Erase extends Component {
    constructor(graphics) {
        super(componentNames.ERASE, graphics);

        /**
         * Brush width
         * @type {number}
         */
        this.width = 30;

        /**
         * Collect all brush path elements and group it with active layer;
         * @type {*[]}
         */
        window.eraserStack = [];

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         */
        this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');
    }

    start(width) {
        const canvas = this.getCanvas();
        canvas.isDrawingMode = true;
        this.setEraser(width);
        canvas.on('path:created', function (opt) {
            opt.path.globalCompositeOperation = 'destination-out';
            window.eraserStack.push(opt);
        });
    }

    setEraser(width) {
        const brush = this.getCanvas().freeDrawingBrush;
        const canvas = this.getCanvas();

        canvas.getContext().globalCompositeOperation = 'globalCompositeOperation';

        this.oColor = new fabric.Color('#ffffff');
        brush.color = this.oColor.toRgba();
        brush.width = width || 30;
    }

    /**
     * End free drawing mode
     */
    end() {
        const canvas = this.getCanvas();
        canvas.isDrawingMode = false;
        canvas.off('path:created');
    }
}
export default Erase;
