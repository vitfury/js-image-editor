import {assignmentForDestroy} from '../util';
import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/erase';
import {defaultTextRangeValus} from '../consts';
import {defaultDrawRangeValus} from '../consts';

/**
 * Crop ui class
 * @class
 * @ignore
 */
export default class Erase extends Submenu {
    constructor(subMenuElement, {locale, makeSvgIcon, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'erase',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });

        this._els = {
            lineSelectButton: this.selector('.tie-draw-line-select-button'),
            eraseRange: new Range({
                slider: this.selector('.tie-erase-range'),
                input: this.selector('.tie-erase-range-value')
            }, defaultDrawRangeValus)
        };

        this.type = null;
        // this.width = this._els.drawRange.value;
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.textRange.destroy();
        assignmentForDestroy(this);
    }

    /**
     * Add event for text
     * @param {Object} actions - actions for text
     *   @param {Function} actions.changeTextStyle - change text style
     */
    addEvent(actions) {
     
        this.actions = actions;
        this._els.eraseRange.on('change', this._changeEraseRange.bind(this));
       
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.textRange.off();
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.type = null;
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.changeStandbyMode();
        console.log("1");
        this.actions.modeChange('erase');
        
    }

    /**
     * Set text size
     * @param {Number} value - text size
     */
    set fontSize(value) {
        this._els.textRange.value = value;
    }

    setTextStyleStateOnAction(textStyle = {}) {
        const {fill, fontSize, fontStyle, fontWeight, textDecoration, textAlign} = textStyle;

        this.textColor = fill;
        this.fontSize = fontSize;
        this.setEffactState('italic', fontStyle);
        this.setEffactState('bold', fontWeight);
        this.setEffactState('underline', textDecoration);
        this.setAlignState(textAlign);
    }

    /**
     * text effect set handler
     * @param {object} event - add button event object
     * @private
     */
    _setTextEffectHandler(event) {
        const button = event.target.closest('.tui-image-editor-button');
        button.classList.toggle('active');
    }

    /**
     * text align set handler
     * @param {number} value - range value
     * @param {boolean} isLast - Is last change
     * @private
     */
    _changeTextRangeHandler(value, isLast) {
        this.actions.changeTextStyle({
            fontSize: value
        }, !isLast);
    }

    _changeEraseRange(value) {
        this.width = value;
    }
}
