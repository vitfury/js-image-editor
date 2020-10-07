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
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.eraseRange.destroy();
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
        this._els.eraseRange.off();
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.modeChange('erase');
        this.actions.changeSelectableAll(false);
    }

    _changeEraseRange(value) {
        this.width = value;
    }
}
