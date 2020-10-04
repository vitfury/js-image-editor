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
            mousedown: this._onFabricMouseDown.bind(this)
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
            'mouse:down': this._listeners.mousedown,'object:selected': this._listeners.select
        });
        canvas.isDrawingMode = 0;
        // eslint-disable-next-line no-undef
    }



    /**
     * End input text mode
     */
    end() {
        const canvas = this.getCanvas();
        canvas.isDrawingMode = false;
        
        canvas.off({
            'mouse:down': this._listeners.mousedown,
            'object:selected': this._listeners.select,
            'before:selection:cleared': this._listeners.selectClear,
            'object:scaling': this._listeners.scaling,
            'text:editing': this._listeners.modify
        });
    }

    /**
     * Erase something on the canvas
     * @param {Object} options - Options for generating text
     *     @param {{x: number, y: number}} [options.position] - Initial position
     * @returns {Promise}
     */
    
     
    add(options) {
        // eslint-disable-next-line no-console
        // console.log(options.width);

        if (typeof options.width === "undefined") {
            options.width = 30;
        }
       

        return new Promise(resolve => {
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

            canvas.add(newPath);
            resolve(this.graphics.createObjectProperties(newPath));
        });
    }

    /**
     * Fabric 'mousedown' event handler
     * @param {fabric.Event} fEvent - Current mousedown event on selected object
     * @private
     */
    _onFabricMouseDown(fEvent) {
        const obj = fEvent.target;

        if (obj && !obj.isType('erase')) {
            return;
        }

        this._fireAddErase(fEvent);
    }

    /**
     * Fire 'addErase' event if object is not selected.
     * @param {fabric.Event} fEvent - Current mousedown event on selected object
     * @private
     */
    _fireAddErase(fEvent) {
        const obj = fEvent.target;
        const e = fEvent.e || {};
        const originPointer = this.getCanvas().getPointer(e);

        if (!obj) {
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
    }

    setStyle(activeObj, styleObj) {
        return new Promise(resolve => {
            snippet.forEach(styleObj, (val, key) => {
                if (activeObj[key] === val && key !== 'fontSize') {
                    styleObj[key] = resetStyles[key] || '';
                }
            }, this);

            if ('textDecoration' in styleObj) {
                snippet.extend(styleObj, this._getTextDecorationAdaptObject(styleObj.textDecoration));
            }

            activeObj.set(styleObj);

            this.getCanvas().renderAll();
            resolve();
        });
    }
}
export default Erase;
