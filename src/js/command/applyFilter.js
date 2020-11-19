/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Apply a filter into an image
 */
import snippet from 'tui-code-snippet';
import commandFactory from '../factory/command';
import {componentNames, rejectMessages, commandNames} from '../consts';

const {FILTER} = componentNames;

/**
 * Chched data for undo
 * @type {Object}
 */
let chchedUndoDataForSilent = null;

/**
 * Make undoData
 * @param {string} type - Filter type
 * @param {Object} prevfilterOption - prev Filter options
 * @param {Object} options - Filter options
 * @returns {object} - undo data
 */
function makeUndoData(type, prevfilterOption, options, image) {
    const undoData = {};

    if (type === 'mask') {
        undoData.object = options.mask;
    }

    undoData.options = prevfilterOption;
    undoData.image = image;

    return undoData;
}

const command = {
    name: commandNames.APPLY_FILTER,

    /**
     * Apply a filter into an image
     * @param {Graphics} graphics - Graphics instance
     * @param {string} type - Filter type
     * @param {Object} options - Filter options
     *  @param {number} options.maskObjId - masking image object id
     * @param {boolean} isSilent - is silent execution or not
     * @returns {Promise}
     */
    execute(graphics, type, options, isSilent) {
        const filterComp = graphics.getComponent(FILTER);

        let image = graphics.getActiveObject();
        if (!this.isRedo) {
            const prevfilterOption = filterComp.getOptions(type);
            const undoData = makeUndoData(type, prevfilterOption, options, image);

            chchedUndoDataForSilent = this.setUndoData(undoData, chchedUndoDataForSilent, isSilent);
        }
        if(this.undoData.image) {
            image = this.undoData.image;
        }
        return filterComp.add(type, options, image);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @param {string} type - Filter type
     * @returns {Promise}
     */
    undo(graphics, type) {
        const filterComp = graphics.getComponent(FILTER);

        if (type === 'mask') {
            const mask = this.undoData.object;
            graphics.add(mask);
            graphics.setActiveObject(mask);

            return filterComp.remove(type, this.undoData.image);
        }

        // options changed case
        if (this.undoData.options) {
            return filterComp.add(type, this.undoData.options, this.undoData.image);
        }

        // filter added case
        return filterComp.remove(type, this.undoData.image);
    }
};

commandFactory.register(command);

export default command;
