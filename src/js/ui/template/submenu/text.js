/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeSvgIcon - svg icon generator
 * @returns {string}
 */
export default ({locale, makeSvgIcon}) => (`
    <ul style="color: white;">${locale.localize('Font family')}</ul>
    <select class="tie-text-font-select">
        <option value="Amatic">Amatic</option>
        <option value="GrenzeGotisch">Grenze gotisch</option>
        <option value="DancingScript">Dancing Script</option>
        <option value="RobotoSlab">Roboto Slab</option>
        <option value="oswald">Oswald</option>
        <option value="SyneTactile">Syne Tactile</option>
        <option value="SyneMono">Syne mono</option>
    </select>
        
    <ul class="tui-image-editor-submenu-item">
        <li class="tie-text-effect-button">
            <div class="tui-image-editor-button bold">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-bold', true)}
                </div>
                <label> ${locale.localize('Bold')} </label>
            </div>
            <div class="tui-image-editor-button italic">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-italic', true)}
                </div>
                <label> ${locale.localize('Italic')} </label>
            </div>
            <div class="tui-image-editor-button underline">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-underline', true)}
                </div>
                <label> ${locale.localize('Underline')} </label>
            </div>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li class="tie-text-align-button">
            <div class="tui-image-editor-button left">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-align-left', true)}
                </div>
                <label> ${locale.localize('Left')} </label>
            </div>
            <div class="tui-image-editor-button center">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-align-center', true)}
                </div>
                <label> ${locale.localize('Center')} </label>
            </div>
            <div class="tui-image-editor-button right">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'text-align-right', true)}
                </div>
                <label> ${locale.localize('Right')} </label>
            </div>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li>
            <div class="tie-text-color" title="${locale.localize('Text color')}"></div>
        </li>
        <li class="tui-image-editor-partition only-left-right">
            <div></div>
        </li>
                <li class=" tui-image-editor-range-wrap">
            <label class="range">${locale.localize('Text size')}</label>
            <div class="tie-text-range text-outline-range-position"></div>
            <input class="tie-text-range-value tui-image-editor-range-value" value="0" />
        </li>
        
        <li class=" tui-image-editor-range-wrap">
            <label class="range">${locale.localize('Stroke size')}</label>
            <div class="tie-text-outline-range text-outline-range-position"></div>
            <input class="tie-text-outline-range-value  tui-image-editor-range-value" value="0" />
        </li>
        <li>
        <div class="tie-text-outline-color" title="${locale.localize('Stroke color')}"></div>
        </li>
        
    </ul>
    <ul style="color: white;">${locale.localize('Stroke form')}</ul>
    <select class="tie-stroke-form-select">
        <option value="soft">${locale.localize('Soft')}</option>
        <option value="chainsaw">${locale.localize('Chainsaw')}</option>
        <option value="pixelize">${locale.localize('Pixelize')}</option>
        <option value="fishbone">${locale.localize('Fishbone')}</option>
    </select>
`);
