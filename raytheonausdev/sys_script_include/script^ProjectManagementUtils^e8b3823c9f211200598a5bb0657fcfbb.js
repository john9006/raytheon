var ProjectManagementUtils = Class.create();

ProjectManagementUtils.prototype = {

    roleId: function(roleName) {
        var gr = new GlideRecord("sys_user_role");
        gr.get("name", roleName);
        return gr.getValue("sys_id");
    },

    getRoleIds: function(roleNameList) {
        var roleIds = [];
        var gr = new GlideRecord("sys_user_role");
        gr.addQuery("name", "IN", roleNameList);
        gr.query();
        while(gr.next())
            roleIds.push(gr.getValue("sys_id"));

        return roleIds.join(",");
    },

    groupHasRole: function(groupId, roleId) {
        var gr = new GlideRecord("sys_group_has_role");
        gr.addQuery("group", groupId);
        gr.addQuery("role", roleId);
        gr.query();
        if(gr.next()) 
            return true;
        return false;
    },
    
    getMembers: function(groupId) {
        var gr = new GlideRecord("sys_user_grmember");
        gr.addQuery("group", groupId);
        gr.query();
        var members = [];
        while (gr.next()) {
            members.push(gr.getValue("user"));
        }
        return members;
    },

    usersWithRoles: function(roleIdList, users, includeTimeCardUser, taskGr) {
		
		var userIds = [];
		var userHasRole = new GlideRecord("sys_user_has_role");
        var join = userHasRole.addJoinQuery("sys_user", "user", "sys_id");
        join.addCondition("active", "true");
        if(users != "" && typeof users != "undefined" && users != null) { // JSUtil.notNil return false for []
            if( users.length> 0 )
                userHasRole.addQuery("user", "IN", users.join(","));
            else
                userHasRole.addQuery("user", "-1"); // dummy sys_id to -1
        }
        userHasRole.addQuery("role", "IN",roleIdList);
        userHasRole.addQuery("state", "active");
        userHasRole.query();
		while (userHasRole.next()){
			userIds.push(userHasRole.getValue('user'));
		}
		
		if (includeTimeCardUser){
			//skip roles
			
			var otherTeamSpaceRoleId = [];
			var userIdWithOtherTeamSpaceRoles = [];
			var gr = new GlideRecord('pm_app_config');
			gr.addQuery('pm_project_table','!=',SNC.PPMConfig.getProjectTable(taskGr.getValue("sys_class_name")));
			gr.query();
			
			while (gr.next()){				
				otherTeamSpaceRoleId.push(this.roleId(SNC.PPMConfig.getProjectRole('user',gr.getValue('pm_project_table'))));
			}
			
			var grToCheckTeamspaceInstalled = new GlideRecord('pm_app_config');
			grToCheckTeamspaceInstalled.query();			
			
			if (!(taskGr.getValue("sys_class_name") == 'pm_project' || taskGr.getValue("sys_class_name") == 'pm_project_task' ) && grToCheckTeamspaceInstalled.next())
				otherTeamSpaceRoleId.push(this.roleId(SNC.PPMConfig.getProjectRole('user','it_project_user')));
				
			
			if (otherTeamSpaceRoleId.length > 0){
				var userWithOtherTeamSpaceRoles = new GlideRecord("sys_user_has_role");
				var joinForOtherTeamSpaceRoles = userWithOtherTeamSpaceRoles.addJoinQuery("sys_user", "user", "sys_id");
				joinForOtherTeamSpaceRoles.addCondition("active", "true");
				userWithOtherTeamSpaceRoles.addQuery("role", "IN",otherTeamSpaceRoleId.join(","));
				userWithOtherTeamSpaceRoles.addQuery("state", "active");
				userWithOtherTeamSpaceRoles.query();
				
				while (userWithOtherTeamSpaceRoles.next()){
					userIdWithOtherTeamSpaceRoles.push(userWithOtherTeamSpaceRoles.getValue('user'));
				}

				var userHasTimeCardRole = new GlideRecord("sys_user_has_role");
				var joinForTimeCardRole = userHasTimeCardRole.addJoinQuery("sys_user", "user", "sys_id");
				joinForTimeCardRole.addCondition("active", "true");
				if (userIdWithOtherTeamSpaceRoles.length > 0)
					joinForTimeCardRole.addCondition('sys_id','NOT IN',userIdWithOtherTeamSpaceRoles.join(","));	
				if(users != "" && typeof users != "undefined" && users != null) { // JSUtil.notNil return false for []
					if( users.length> 0 )
						userHasTimeCardRole.addQuery("user", "IN", users.join(","));
					else
						userHasTimeCardRole.addQuery("user", "-1"); // dummy sys_id to -1
				}
				userHasTimeCardRole.addQuery("role",this.getRoleIds('timecard_user'));
				userHasTimeCardRole.addQuery("state", "active");
				userHasTimeCardRole.query();
				while (userHasTimeCardRole.next()){
					userIds.push(userHasTimeCardRole.getValue('user'));
				}
				
				return userIds;				

			}
			else { //no other teamspace installed
				
				var userHasTimeCardRole = new GlideRecord("sys_user_has_role");
				var joinForTimeCardRole = userHasTimeCardRole.addJoinQuery("sys_user", "user", "sys_id");
				joinForTimeCardRole.addCondition("active", "true");	
				if(users != "" && typeof users != "undefined" && users != null) { // JSUtil.notNil return false for []
					if( users.length> 0 )
						userHasTimeCardRole.addQuery("user", "IN", users.join(","));
					else
						userHasTimeCardRole.addQuery("user", "-1"); // dummy sys_id to -1
				}
				userHasTimeCardRole.addQuery("role",this.getRoleIds('timecard_user'));
				userHasTimeCardRole.addQuery("state", "active");
				userHasTimeCardRole.query();
				
				while (userHasTimeCardRole.next())
					userIds.push(userHasTimeCardRole.getValue('user'));
				
				return userIds;
			}

		}
			
        return userIds;
		
		
    },
    
    getUsersRefQualByRoleName : function(roleName) {
        /*var userWithRoleGr = this.usersWithRole(this.roleId(roleName));
        var userWithRole = [];
        while(userWithRoleGr.next()) {
            userWithRole.push(userWithRoleGr.getValue("user"));
        }
        return "sys_idIN" + userWithRole.join(",");*/
        return "roles=" + roleName;
    },

    assignedToRefQualFromResourcePlan: function (taskGr, defaultRole, includeTimeCardUser) {
        // if we need more roles - create an array and validate the same
        var users = [], usersWithRole = [];
        var topTaskId = taskGr.getValue("top_task");
        var gr = new GlideAggregate('resource_allocation');
        gr.addQuery('resource_plan.state', '3');
        gr.addQuery('resource_plan.top_task', topTaskId);
        gr.addQuery('booking_type', '1');
        gr.addAggregate('COUNT');
        gr.groupBy('user');
        gr.query();
        while(gr.next())
            users.push(gr.getValue('user'));

        if(users.length > 0) {
			var usersWithRoleGr = this.usersWithRoles(this.roleId(defaultRole), users, includeTimeCardUser, taskGr);
			usersWithRole = usersWithRoleGr;
        }
        return usersWithRole;
    },

    assignResourcesFromResourcePlan: function(taskGr) {
        if(JSUtil.notNil(taskGr) && JSUtil.notNil(taskGr.getValue("top_task"))) {
            if(taskGr.getValue("sys_id") == taskGr.getValue("top_task")) {
                return taskGr.getValue("resources_from_resource_plan");
            } else {
                var projectGr = taskGr.top_task.getRefRecord();
                return projectGr.getValue("resources_from_resource_plan");
                }
        }  // return nothing
    },

    assignedToRefQual: function(taskGr, defaultRole, includeTimeCardUser) {
        var users = [];
        if (JSUtil.nil(defaultRole))
           defaultRole = SNC.PPMConfig.getProjectRole('user',taskGr.getValue("sys_class_name"));
		
			
        var assignResourcesFromResourcePlan = this.assignResourcesFromResourcePlan(taskGr);
		gs.log("flag value:" + assignResourcesFromResourcePlan);
        if(JSUtil.notNil(assignResourcesFromResourcePlan) && ( assignResourcesFromResourcePlan == '1' || 
            assignResourcesFromResourcePlan == "true")) {
            users = this.assignedToRefQualFromResourcePlan(taskGr, defaultRole, includeTimeCardUser);
            return "sys_idIN" + users.join(",");
        } 		
        var usersWithRole;
        var roleIds = this.getRoleIds(defaultRole);

        var groupId = taskGr.getValue('assignment_group');
		
        if (JSUtil.notNil(groupId)) {  
            // Group May not have the roles, However user can have the roles
            var groupUsers = this.getMembers(groupId);
			usersWithRole = this.usersWithRoles(this.roleId(defaultRole), groupUsers, includeTimeCardUser, taskGr);
        } else {
			usersWithRole = this.usersWithRoles(this.roleId(defaultRole),"", includeTimeCardUser, taskGr);
        }
		users = usersWithRole;
		
        var returnValue = "sys_idIN" + users.join(",");

        return returnValue;
    },

    parentRefQual: function() {
        var plannedTaskExtensions = (new TableUtils("planned_task")).getAllExtensions();
        var taskTypes = [];
        for (var i = 0; i < plannedTaskExtensions.size(); i++) {
            taskTypes.push(plannedTaskExtensions.get(i));
        }
        return "sys_class_nameIN" + taskTypes.join(',');
    },

    type: "ProjectManagementUtils"
};