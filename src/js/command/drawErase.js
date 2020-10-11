/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Add a text object
 */
import commandFactory from '../factory/command';
import {Promise} from '../util';
import {componentNames, commandNames, rejectMessages} from '../consts';
const {ERASE} = componentNames;

const command = {
    name: commandNames.DRAW_ERASE,

    /**
     * Add an erase object
     * @param {Graphics} graphics - Graphics instance
     * @param {string} text - Initial input text
     * @param {Object} [options] Options for text styles
     *     @param {Object} [options.styles] Initial styles
     *         @param {string} [options.styles.fill] Color
     *         @param {string} [options.styles.fontFamily] Font type for text
     *         @param {number} [options.styles.fontSize] Size
     *         @param {string} [options.styles.fontStyle] Type of inclination (normal / italic)
     *         @param {string} [options.styles.fontWeight] Type of thicker or thinner looking (normal / bold)
     *         @param {string} [options.styles.textAlign] Type of text align (left / center / right)
     *         @param {string} [options.styles.textDecoration] Type of line (underline / line-through / overline)
     *     @param {{x: number, y: number}} [options.position] - Initial position
     * @returns {Promise}
     */
    execute(graphics, options) {
        const eraseComp = graphics.getComponent(ERASE);

        if (this.undoData.object) {
            const undoObject = this.undoData.object;

            return new Promise((resolve, reject) => {
                if (!graphics.contains(undoObject)) {
                    graphics.add(undoObject);
                    resolve(undoObject);
                } else {
                    reject(rejectMessages.redo);
                }
            });
        }
        return eraseComp.draw(options).then(objectProps => {
            const {id} = objectProps;
            const eraseObject = graphics.getObject(id);

            this.undoData.object = eraseObject;

            return objectProps;
        });
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        graphics.remove(this.undoData.object);

        return Promise.resolve();
    }
};

commandFactory.register(command);

export default command;