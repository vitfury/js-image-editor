/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Add an object
 */
import commandFactory from '../factory/command';
import {Promise} from '../util';
import {commandNames, fObjectOptions, rejectMessages} from '../consts';
import fabric from 'fabric';

const command = {
    name: commandNames.STICK_ERASER,

    /**
     * Add an object
     * @param {Graphics} graphics - Graphics instance
     * @param {Object} eraseObject - Fabric object
     * @returns {Promise}
     */
    execute(graphics, eraseObject) {
        const canvas = graphics._canvas;
        if(this.isRedo) {
            canvas.remove(this.undoData.oldObject);
            canvas.add(this.undoData.newObject);
            canvas.renderAll();
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const objects = canvas._objects;
            if (!Object.keys(objects).length) {
                // no any objects. Delete eraser
                return {};
            }
            var command = this;

            // Stick eraser to the latest uploaded image
            let reversedObjects = objectKeys.reverse();
            reversedObjects.forEach(function(objectKey) {
                const currentObject = objects[objectKey];
                // Walk only through images
                if(currentObject.get('type') === 'image' && currentObject.intersectsWithObject(eraseObject)) {
                    var imageWithEraser = new fabric.Group([currentObject, eraseObject]);

                    const resultPositionX = imageWithEraser.left;
                    const resultPositionY = imageWithEraser.top;

                    var exportedImage = imageWithEraser.toDataURL();
                    fabric.Image.fromURL(exportedImage, newObject => {
                        newObject.set({
                            left: resultPositionX,
                            top: resultPositionY,
                            crossOrigin: 'Anonymous',
                            borderColor: "#fff",
                            cornerColor: "#fff",
                            cornerSize: 16,
                            cornerStrokeColor: "#fff",
                            cornerStyle: "circle",
                            lineWidth: 3,
                            transparentCorners: false
                        });
                        canvas.remove(currentObject);
                        canvas.remove(eraseObject);
                        canvas.add(newObject);
                        canvas.renderAll();
                        // return undo data
                        command.undoData = {
                            oldObject: currentObject,
                            newObject: newObject
                        };
                        resolve();
                    });
                }
            });

            canvas.remove(eraseObject);
            canvas.renderAll();
            // no occcurances found
            // delete eraseObject
            // return empty undodata;
        });
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @param {Object} object - Fabric object
     * @returns {Promise}
     */
    undo(graphics, undoData) {
        var undoData = this.undoData;
        if (graphics.contains(undoData.newObject)) {
            graphics.remove(undoData.newObject);
            graphics.add(undoData.oldObject);
        }
        return Promise.resolve();
    }
};

commandFactory.register(command);

export default command;
