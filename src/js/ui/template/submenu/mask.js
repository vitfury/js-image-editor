/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeSvgIcon - svg icon generator
 * @returns {string}
 */
export default ({locale, makeSvgIcon}) => (`
    <ul class="tui-image-editor-submenu-item">
        <li>
            <div class="tui-image-editor-button">
                <div>
                    <input type="file" accept="image/*" class="tie-mask-image-file">
                    ${makeSvgIcon(['normal', 'active'], 'mask-load', true)}
                </div>
                <label> ${locale.localize('Load')} </label>
            </div>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li>
            <div class="tui-image-editor-button remove-background">
                <label><input type="checkbox" class="remove-background-checkbox" checked="true"> ${locale.localize('Remove Background')}</label>
            </div>
        </li>
    </ul>
`);
