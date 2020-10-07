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
         * Listeners for fabric event
         * @type {Object}
         */
        this._listeners = {
            mousedown: this._onFabricMouseDown.bind(this),
            mouseup: this._onFabricMouseUp.bind(this),
            mousemove: this._onFabricMouseMove.bind(this)
        };

        /**
         * Ratio of current canvas
         * @type {number}
         */
        this._ratio = 1;
    }

    /**
     * Start input text mode
     */
    start() {
        const canvas = this.getCanvas();
        canvas.on({
            'mouse:down': this._listeners.mousedown,
            'mouse:up': this._listeners.mouseup,
            'mouse:move': this._listeners.mousemove,
        });
    }

    /**
     * End input text mode
     */
    end() {
        const canvas = this.getCanvas();

        canvas.off({
            'mouse:down': this._listeners.mousedown,
            'mouse:move': this._listeners.mousemove,
            'mouse:up': this._listeners.mouseup,
        });
    }

    add(options) {

        if (typeof options.width === "undefined") {
            options.width = 30;
        }

        return new Promise(resolve => {
            this._isSelected = false;
            const canvas = this.getCanvas();
            // canvas.selection = false;

            const newPath = new fabric.Path(`M 100 100 a ${options.width} ${options.width} 0 1 0 0.00001 0`);
            newPath.set({
                nameType: 'eraser',
                left: options.position.x,
                top: options.position.y,
                globalCompositeOperation: 'destination-out',
                selectable: false,
                evented: false,
                originX: 'center',
                originY: 'center',
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            });

            if(typeof this.draw !== "undefined" && this.draw) {
                canvas.add(newPath);
            }

            resolve(this.graphics.createObjectProperties(newPath));
        });
    }

    /**
     * Fabric 'mousedown' event handler
     * @param {fabric.Event} fEvent - Current mousedown event on selected object
     * @private
     */
    _onFabricMouseDown(fEvent) {
        this.draw = true;
        this.graphics.getCanvas().selection = false;
    }
    _onFabricMouseUp(fEvent) {
        this.draw = false;
        this.graphics.getCanvas().selection = true;
    }

    _onFabricMouseMove(fEvent) {
        this._fireDrawErase(fEvent);
    }

    _fireAddErase(fEvent) {
        const e = fEvent.e || {};
        const originPointer = this.getCanvas().getPointer(e);

        this.fire(events.ADD_ERASE, {
            originPosition: {
                x: originPointer.x,
                y: originPointer.y
            },
            clientPosition: {
                x: e.clientX || 0,
                y: e.clientY || 0
            }
        });
    }

    _fireDrawErase(fEvent) {
        const e = fEvent.e || {};
        const originPointer = this.getCanvas().getPointer(e);

        this.fire(events.DRAW_ERASE, {
            originPosition: {
                x: originPointer.x,
                y: originPointer.y
            },
            clientPosition: {
                x: e.clientX || 0,
                y: e.clientY || 0
            }
        });
    }
}
export default Erase;
