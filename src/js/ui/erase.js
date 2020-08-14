import {assignmentForDestroy} from '../util';
import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/erase';
import {defaultTextRangeValus} from '../consts';

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
            textRange: new Range({
                slider: this.selector('.tie-text-range'),
                input: this.selector('.tie-text-range-value')
            }, defaultTextRangeValus)
        };
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
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        const {setTextEffect, setTextAlign} = this.eventHandler;
        this._els.textRange.off();
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.actions.stopDrawingMode();
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
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
    _changeTextRnageHandler(value, isLast) {
        this.actions.changeTextStyle({
            fontSize: value
        }, !isLast);
    }
}
