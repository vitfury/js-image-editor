import Submenu from './submenuBase';
import {assignmentForDestroy, isSupportFileApi} from '../util';
import templateHtml from './template/submenu/mask';

/**
 * Mask ui class
 * @class
 * @ignore
 */
class Mask extends Submenu {
    constructor(subMenuElement, {locale, makeSvgIcon, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'mask',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });

        this._els = {
            maskImageButton: this.selector('.tie-mask-image-file'),
            removeBackgroundCheckbox: this.selector('.remove-background-checkbox')
        };
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();

        assignmentForDestroy(this);
    }

    /**
     * Add event for mask
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.loadImageFromURL - load image action
     */
    addEvent(actions) {
        const loadMaskFile = this._loadMaskFile.bind(this);

        this.eventHandler = {
            loadMaskFile,
        };

        this.actions = actions;
        this._els.maskImageButton.addEventListener('change', loadMaskFile);
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.maskImageButton.removeEventListener('change', this.eventHandler.loadMaskFile);
    }

    /**
     * Load mask file
     * @param {object} event - File change event object
     * @private
     */
    _loadMaskFile(event) {

        let imgUrl;

        if (!isSupportFileApi()) {
            alert('This browser does not support file-api');
        }

        const [file] = event.target.files;

        if(!file) {
            return;
        }

        if (typeof Editor === 'undefined') {
            imgUrl = URL.createObjectURL(file);
            this.actions.loadImageFromURL(imgUrl, file);
            return;
        }

        Editor.UI.ShowModalLoader();
        const processingFunction = this._els.removeBackgroundCheckbox.checked ?
            App.Api.RemoveBackground :
            App.Api.Resize;
        var actions = this.actions;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var data = {
                dimensions: {
                    width: 512,
                    height: 512
                },
                image: reader.result.split('base64,')[1]
            };
            var successCallback = function(response) {
                imgUrl = 'data:image/png;base64,' + response.image;
                actions.loadImageFromURL(imgUrl, file);
                if(typeof Editor !== 'undefined') {
                    Editor.UI.HideModalLoader();
                    Editor.Instance._graphics.getCanvas().renderAll()
                }
            };
            var errorCallback = function(response) {
                console.log('error');
                console.log(response);
            };
            processingFunction(data, successCallback, errorCallback)
        };
        reader.onerror = function (error) {
            alert('Error: ', error);
        };

    }
}

export default Mask;
