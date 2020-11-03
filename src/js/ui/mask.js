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

        if (file) {
            imgUrl = URL.createObjectURL(file);
            this.actions.loadImageFromURL(imgUrl, file);
            return;
        }

        if (file) {
            $('#editor-progressBarDiv').show();

            var actions = this.actions;
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                //HERE
                var imageBase64 = reader.result;
                imageBase64 = imageBase64.split('base64,')[1];
                var body = {

                    dimensions: {
                        width: 512,
                        height: 512
                    },
                    image: imageBase64
                }

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/image/removeBackground', false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(body));
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                }
                var tmpImgResponse = JSON.parse(xhr.responseText)
                var tmpImgBase64 = tmpImgResponse.image;
                imgUrl = 'data:image/png;base64,' + tmpImgBase64;

                // var tempResponse = xhr.responseText;
                // var responseImg = tempResponse.split(',')[1];
                $('#editor-progressBarDiv').hide();

                // imgUrl = 'data:image/'+';base64,' + responseImg;
                actions.loadImageFromURL(imgUrl, file);
            };
            reader.onerror = function (error) {
                alert('Error: ', error);
            };
        }
    }
}

export default Mask;
