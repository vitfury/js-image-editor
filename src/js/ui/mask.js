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
            maskImageButton: this.selector('.tie-mask-image-file')
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

        if (file) {
            imgUrl = URL.createObjectURL(file);


            // Convert image to base64
            var tmpImg = document.getElementById("uploaded-image");
            tmpImg.src=imgUrl;
            var canvas = document.createElement("canvas");
            canvas.width = tmpImg.width;
            canvas.height = tmpImg.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(tmpImg, 0, 0);
            var dataURL = canvas.toDataURL("image/png");


            var tmpImgBase64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            //tut otpravka na server

            this.actions.loadImageFromURL(imgUrl, file);
        }
    }
}

export default Mask;
