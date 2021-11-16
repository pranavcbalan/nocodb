
let t0 = require('./explicitLogin')
let t00 = require('../common/00_pre_configurations')
let t1a = require('../common/1a_table_operations')
let t1b = require('../common/1b_table_column_operations')
let t1c = require('../common/1c_table_row_operations')
let t2a = require('../common/2a_table_with_belongs_to_colulmn')
let t2b = require('../common/2b_table_with_m2m_column')
let t3a = require('../common/3a_filter_sort_fields_operations')
let t3b = require('../common/3b_formula_column')
let t3c = require('../common/3c_lookup_column')
let t3d = require('../common/3d_rollup_column')
let t4a = require('../common/4a_table_view_grid_gallery_form')
let t4b = require('../common/4b_table_view_share')
let t4c = require('../common/4c_form_view_detailed')
let t4d = require('../common/4d_table_view_grid_locked')
let t4e = require('../common/4e_form_view_share')
let t4f = require('../common/4f_grid_view_share')
let t5a = require('../common/5a_user_role')
let t5b = require('../common/5b_preview_role')
// merged with t1a: let t6a = require('../common/6a_audit')
let t6c = require('../common/6c_swagger_api')
let t6d = require('../common/6d_language_validation')
let t6e = require('../common/6e_project_operations')

// use 0 as mode to execute individual files (debug mode, skip pre-configs)
// use 1 mode if noco.db doesnt contain user credentials (full run over GIT)
const executionMode = 1

const nocoTestSuite = (type, xcdb) => {

    if (0 == executionMode) {
        t0.genTest(type, xcdb)
    } else {
        t00.genTest(type, xcdb)
    }    

    t1a.genTest(type, xcdb)
    t1b.genTest(type, xcdb)
    // merged with t1b: t1c.genTest(type, xcdb)
    t2a.genTest(type, xcdb)
    t2b.genTest(type, xcdb)
    t3a.genTest(type, xcdb)
    t3b.genTest(type, xcdb)
    t3c.genTest(type, xcdb)
    t3d.genTest(type, xcdb)
    t4a.genTest(type, xcdb)
    t4b.genTest(type, xcdb)
    t4c.genTest(type, xcdb)
    t4d.genTest(type, xcdb)
    t4e.genTest(type, xcdb)
    t4f.genTest(type, xcdb)
    t5a.genTest(type, xcdb)
    t5b.genTest(type, xcdb)
    // merged with t1a: t6a.genTest(type, xcdb)
    t6c.genTest(type, xcdb)
    t6d.genTest(type, xcdb)
    // **deletes created project, hence place it @ end
    t6e.genTest(type, xcdb)    
}

nocoTestSuite('rest', false)
// nocoTestSuite('graphql', false)

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




