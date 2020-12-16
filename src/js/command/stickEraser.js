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
     * @returns {Promise}
     */
    execute(graphics) {

        var eraserElements = [];
        graphics._canvas._objects.forEach(function(item, key){
            if(item.globalCompositeOperation === 'destination-out') {
                eraserElements.push(item);
            }
        });
        var eraserGroup = new fabric.Group(eraserElements);

        // imageEditor.addObject(eraserGroup);
        graphics._canvas.add(eraserGroup);
        graphics._canvas.renderAll();

        //Remove erase elements from undo stack
        var undoStack = imageEditor._invoker._undoStack;
        if(!undoStack) {
            resolve();
            return;
        }
        undoStack.forEach(function(item, key){
            if(item.args[1] && item.args[1].globalCompositeOperation) {
                var elementPosition = undoStack.indexOf(item);
                imageEditor._graphics._canvas.remove(item);
                undoStack.splice(elementPosition, 1);
            }
        });

        //Remove elements from canvas
        imageEditor._graphics._canvas.getObjects().forEach(function(item){
            if(item.globalCompositeOperation === 'destination-out') {
                imageEditor._graphics._canvas.remove(item);
            }
        });


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
            let reversedObjects = Object.keys(objects).reverse();
            reversedObjects.forEach(function(objectKey) {
                const currentObject = objects[objectKey];
                // Walk only through images
                if(currentObject.get('type') === 'image' && currentObject.intersectsWithObject(eraserGroup)) {
                    var imageWithEraser = new fabric.Group([currentObject, eraserGroup]);

                    const resultPositionX = imageWithEraser.left;
                    const resultPositionY = imageWithEraser.top;

                    var exportedImage = imageWithEraser.toDataURL();
                    fabric.Image.fromURL(exportedImage, newObject => {
                        newObject.set({
                            left: resultPositionX,
                            top: resultPositionY,
                            crossOrigin: 'Anonymous',
                        });
                        canvas.remove(currentObject);
                        canvas.remove(eraserGroup);
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

            canvas.remove(eraserGroup);
            canvas.renderAll();
            resolve();
            // no occcurances found
            // delete eraserGroup
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
        if (undoData && graphics.contains(undoData.newObject)) {
            graphics.remove(undoData.newObject);
            graphics.add(undoData.oldObject);
        }
        return Promise.resolve();
    }
};

commandFactory.register(command);

export default command;
