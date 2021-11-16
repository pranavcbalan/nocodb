
const path = require("path");

/**
 * Delete the downloads folder to make sure the test has "clean"
 * slate before starting.
 */
export const deleteDownloadsFolder = () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  cy.task('deleteFolder', downloadsFolder)
}

// main page
export class _mainPage {

    constructor() {

        // Top Right items
        this.SHARE = 0
        this.THEME_BODY = 1
        this.THEME_HEADER = 2
        this.ALERT = 3
        this.LANGUAGE = 4
        this.USER = 5

        // Top Left items
        this.HOME = 0
        this.GIT_HOME = 1
        this.GIT_STAR = 2
        this.GIT_DOCS = 3

        this.AUDIT = 0
        this.APPSTORE = 2
        this.TEAM_N_AUTH = 3
        this.PROJ_METADATA = 4
        this.ROLE_VIEW = 5
        this.ROLE_VIEW_EDITOR = 6
        this.ROLE_VIEW_COMMENTER = 7
        this.ROLE_VIEW_VIEWER = 8
        this.ROLE_VIEW_RESET = 9

        this.roleURL = {}
    }

    toolBarTopLeft(toolBarItem) {
        return cy.get('header.v-toolbar', {timeout: 20000}).eq(0).find('a').eq(toolBarItem)
    }

    toolBarTopRight(toolBarItem) {
        return cy.get('header.v-toolbar', {timeout: 20000}).eq(0).find('button').eq(toolBarItem)
    }

    navigationDraw(item) {
        // if (item == this.ROLE_VIEW)
        //     return cy.get('.nc-nav-drawer').find('.v-list').last()
        // else
        //     return cy.get('.nc-nav-drawer').find('.v-list > .v-list-item').eq(item)

        switch (item) {
            case this.AUDIT:
                return cy.get('.nc-treeview-item-Audit')
            case this.APPSTORE:
                return cy.get('.nc-settings-appstore')
            case this.TEAM_N_AUTH:
                return cy.get('.nc-settings-teamauth')
            case this.PROJ_METADATA:
                return cy.get('.nc-settings-projmeta')
            case this.ROLE_VIEW_EDITOR:
                return cy.get('.nc-preview-editor')
            case this.ROLE_VIEW_COMMENTER:
                return cy.get('.nc-preview-commenter')
            case this.ROLE_VIEW_VIEWER:
                return cy.get('.nc-preview-viewer')
            case this.ROLE_VIEW_RESET:
                return cy.get('.nc-preview-reset')
        }
    }


    // add new user to specified role
    //
    addNewUserToProject = (userCred, roleType) => {

        let linkText

        // click on New User button, feed details
        cy.get('button:contains("New User")').first().click()
        cy.get('label:contains("Email")').next('input').type(userCred.username).trigger('input')
        cy.get('label:contains("Select User roles")').click()

        // opt-in requested role & submit
        // note that, 'editor' is set by default
        //
        cy.getActiveMenu().contains(roleType).click()
        cy.getActiveMenu().contains('editor').click()
        cy.get('.mdi-menu-down').last().click()
        cy.get('.nc-invite-or-save-btn').click()

        // get URL, invoke
        cy.getActiveModal().find('.v-alert').then(($obj) => {
            linkText = $obj.text().trim()
            cy.log(linkText)
            this.roleURL[roleType] = linkText

            cy.get('body').click('right')

            // cy.visit(linkText)

            // cy.wait(3000)

            // // Redirected to new URL, feed details
            // //
            // cy.get('input[type="text"]').type(userCred.username)
            // cy.get('input[type="password"]').type(userCred.password)
            // cy.get('button:contains("SIGN UP")').click()

            // cy.url({ timeout: 6000 }).should('contain', '#/project')
            // cy.wait(1000)
        })
    }

    addExistingUserToProject = (emailId, role) => {

        cy.get('.v-list-item:contains("Team & Auth")').click()
        cy.get(`tr:contains(${emailId})`).find('.mdi-plus', { timeout: 2000 }).click()
        cy.get(`tr:contains(${emailId})`).find('.mdi-pencil-outline', { timeout: 2000 }).click()

        cy.get('label:contains(Select User roles)').click()

        // opt-in requested role & submit
        // note that, 'editor' is set by default
        //
        cy.getActiveMenu().contains(role).click()
        cy.getActiveMenu().contains('editor').click()
        cy.get('.mdi-menu-down').click()
        cy.get('.nc-invite-or-save-btn').click()
        cy.wait(1000)

        this.roleURL[role] = "http://localhost:3000/#/user/authentication/signin"
    }

    getCell = (columnHeader, cellNumber) => {
        return cy.get(`tbody > :nth-child(${cellNumber}) > [data-col="${columnHeader}"]`)
    }

    getPagination = (pageNumber) => {
        if (pageNumber == '<')
            return cy.get('.nc-pagination .v-pagination > li:first-child')
        if (pageNumber == '>')
            return cy.get('.nc-pagination .v-pagination > li:last-child')
            
        return cy.get(`.nc-pagination .v-pagination > li:contains(${pageNumber}) button`)
    }

    getRow = (rowIndex) => {
        return cy.get('.xc-row-table').find('tr').eq(rowIndex)
    }

    addColumn = (colName) => {
        cy.get('.v-window-item--active .nc-grid  tr > th:last button').click({ force: true });
        cy.get('.nc-column-name-input input', { timeout: 3000 }).clear().type(colName)
        cy.get('.nc-col-create-or-edit-card').contains('Save').click()
    }

    addColumnWithType = (colName, colType) => {
        cy.get('.v-window-item--active .nc-grid  tr > th:last button').click({ force: true });
        cy.get('.nc-column-name-input input', { timeout: 3000 }).clear().type(colName)

        // Column data type: to be set to lookup in this context
        cy.get('.nc-ui-dt-dropdown').click()
        cy.getActiveMenu().contains(colType).click()
        
        cy.get('.nc-col-create-or-edit-card').contains('Save').click()
        cy.wait(500)
    }

    deleteColumn = (colName) => {
        cy.get(`th:contains(${colName}) .mdi-menu-down`)
            .trigger('mouseover')
            .click()

        cy.get('.nc-column-delete', {timeout: 5000}).click()
        cy.get('button:contains(Confirm)').click()        
    }

    getAuthToken = () => {
        let obj = JSON.parse(localStorage['vuex'])
        return obj["users"]["token"]
    }

    configureSMTP = (from, host, port, secure) => {
        cy.get('.v-card__title.title')
            .contains('SMTP')
            .parents('.elevatio')
            .find('button')
            .contains(" Install ")
            .click({ force: true })
        cy.getActiveModal().find('[placeholder="eg: admin@example.com"]').click().type(from)
        cy.getActiveModal().find('[placeholder="eg: smtp.example.com"]').click().type(host)
        cy.getActiveModal().find('[placeholder="Port"]').click().type(port)
        cy.getActiveModal().find('[placeholder="Secure"]').click().type(secure)
        cy.getActiveModal().find('button').contains('Save').click()
    }

    resetSMTP = () => {
        cy.get('.v-card__title.title')
            .contains('SMTP')
            .parents('.elevatio')
            .find('button')
            .contains(" Reset ")
            .click({ force: true })
        cy.getActiveModal().find('button').contains('Submit').click()
    }

    hideUnhideField = (field) => {
        cy.get('.nc-fields-menu-btn').click()
        cy.get(`.menuable__content__active .v-list-item label:contains(${field})`).click()
        cy.get('.nc-fields-menu-btn').click()
    }

    sortField = (field, criteria) => {
        cy.get('.nc-sort-menu-btn').click()
        cy.contains('Add Sort Option').click();
        cy.get('.nc-sort-field-select div').first().click()
        cy.get(`.menuable__content__active .v-list-item:contains(${field})`).click()
        cy.get('.nc-sort-dir-select div').first().click()
        cy.get(`.menuable__content__active .v-list-item:contains(${criteria})`).click()
        cy.get('.nc-sort-menu-btn').click()
    }

    clearSort = () => {
        cy.get('.nc-sort-menu-btn').click()
        cy.get('.nc-sort-item-remove-btn').click()
        cy.get('.nc-sort-menu-btn').click()   
    }

    filterField = (field, operation, value) => {
        cy.get('.nc-filter-menu-btn').click()
        cy.contains('Add Filter').click();

        cy.get('.nc-filter-field-select').last().click();
        cy.getActiveMenu().find(`.v-list-item:contains(${field})`).first().click()
        cy.get('.nc-filter-operation-select').last().click();
        cy.getActiveMenu().find(`.v-list-item:contains(${operation})`).click()
        if ((operation != 'is null') && (operation != 'is not null')) {
            cy.get('.nc-filter-value-select input:text').last().type(`${value}`);
        }
        cy.get('.nc-filter-menu-btn').click()
    }

    filterReset = () => {
        cy.get('.nc-filter-menu-btn').click()
        cy.get('.nc-filter-item-remove-btn').click()
        cy.get('.nc-filter-menu-btn').click()          
    }

    // delete created views
    //
    deleteCreatedViews = () => {
        cy.get('.v-navigation-drawer__content > .container')
            .find('.v-list > .v-list-item')
            .contains('Share View')
            .parent().find('button.mdi-dots-vertical').click()

        cy.getActiveMenu().find('.v-list-item').contains('Views List').click()

        cy.wait(1000)

        // cy.get('.container').find('button.mdi-delete-outline')

        cy.get('th:contains("View Link")').parent().parent()
            .next().find('tr').each(($tableRow) => {
                cy.log($tableRow[0].childElementCount)

                // one of the row would contain seggregation header ('other views)
                if (4 == $tableRow[0].childElementCount) {
                    cy.wrap($tableRow).find('button').last().click()
                    cy.wait(1000)                
                }
            })
            .then(() => {
            cy.get('.v-overlay__content > .d-flex > .v-icon').click()
        })
    }
    
    // download CSV & verify
    // download folder is configurable in cypress.
    //      trigger download
    //      wait for a while & check in configured download folder for the intended file
    //      if it exists, verify it against 'expectedRecords' passed in as parameter
    //
    downloadAndVerifyCsv = (filename, verifyCsv) => {
        cy.get('.nc-actions-menu-btn').click()
        cy.get(`.menuable__content__active .v-list-item span:contains("Download as CSV")`).click()

        // Toast verification disabled as for larger table, multiple toasts appear before success one
        // for each partitioned file
        // cy.get('.toasted', { timeout: 5000 })
        //     .contains('Successfully exported all table data')
        //     .should('exist')
        cy.wait(5000)
            .then(() => {

                // download folder path, read from config file
                const downloadsFolder = Cypress.config("downloadsFolder")
                let filePath = path.join(downloadsFolder, filename)
                
                // append download folder path with filename to generate full file path, retrieve file
                cy.readFile(filePath)
                    .then((fileData) => {

                        // from CSV, split into records (rows)
                        const rows = fileData.replace(/\r\n/g, '\n').split('\n');
                        verifyCsv(rows)
                        deleteDownloadsFolder()
                })
            })        
    }
}


export const mainPage = new _mainPage;


/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Raju Udava <sivadstala@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
