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
        canvas.defaultCursor = 'pointer';
        canvas.on({
            'mouse:down': this._listeners.mousedown,'object:selected': this._listeners.select
        });
        canvas.selection = false;
    }

    /**
     * End input text mode
     */
    end() {
        const canvas = this.getCanvas();
        canvas.defaultCursor = 'pointer';
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
        return new Promise(resolve => {
            const canvas = this.getCanvas();
            const newPath = new fabric.Path('M9.141 19.426c-1.923-.142-3.715-.83-5.236-2.008-.561-.435-1.2-1.072-1.648-1.64-.966-1.223-1.628-2.687-1.903-4.203-.108-.591-.141-.925-.152-1.574-.015-.81.046-1.462.201-2.193.591-2.766 2.381-5.139 4.892-6.486.951-.509 2.054-.872 3.11-1.025.545-.079.727-.09 1.399-.092.656 0 .789.008 1.306.075 1.696.219 3.339.92 4.7 2.003.432 .344.964 .858 1.324 1.277 1.17 1.363 1.954 3.082 2.209 4.848.079 .538.09 .722.09 1.412 0 .805-.036 1.213-.172 1.89-.314 1.579-1.016 3.036-2.077 4.313-.223.268-.9.944-1.17 1.169-1.614 1.339-3.465 2.085-5.548 2.236-.264.018-1.061.018-1.326-.002z');
            newPath.set({
                nameType: 'eraser',
                left: options.position.x,
                top: options.position.y,
                globalCompositeOperation: 'destination-out',
                selectable: false,
                evented: false
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
