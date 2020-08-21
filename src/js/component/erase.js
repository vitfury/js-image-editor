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
            const newPath = new fabric.Path('M36.564 77.704c-7.692-.568-14.86-3.32-20.944-8.032-2.244-1.74-4.8-4.288-6.592-6.56-3.864-4.892-6.512-10.748-7.612-16.812-.432-2.364-.564-3.7-.608-6.296-.06-3.24.184-5.848.804-8.772 2.364-11.064 9.524-20.556 19.568-25.944 3.804-2.036 8.216-3.488 12.44-4.1 2.18-.316 2.908-.36 5.596-.368 2.624 0 3.156.032 5.224.3 6.784.876 13.356 3.68 18.8 8.012 1.728 1.376 3.856 3.432 5.296 5.108 4.68 5.452 7.816 12.328 8.836 19.392.316 2.152.36 2.888.36 5.648 0 3.22-.144 4.852-.688 7.56-1.256 6.316-4.064 12.144-8.308 17.252-.892 1.072-3.6 3.776-4.68 4.676-6.456 5.356-13.86 8.34-22.192 8.944-1.056.072-4.244.072-5.304-.008z');
            newPath.set({
                nameType: 'eraser',
                left: options.position.x,
                top: options.position.y,
                globalCompositeOperation: 'destination-out',
                selectable: false,
                evented: false,
                originX: 'center', 
                originY: 'center'
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
