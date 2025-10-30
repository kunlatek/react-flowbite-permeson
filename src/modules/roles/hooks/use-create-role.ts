import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { IRoleFormData, IPermission } from "../interfaces";
import { AVAILABLE_MODULES, AVAILABLE_ACTIONS } from "../constants/roles.constants";

import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";

import { createRole } from "../api/create-role";

export const useCreateRole = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { workspace } = useWorkspace();

  const [formData, setFormData] = useState<IRoleFormData>({
    name: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionsChange = (permissions: IPermission[]) => {
    setFormData(prev => ({
      ...prev,
      permissions
    }));
  };

  const addPermission = () => {
    const newPermission: IPermission = {
      module: "",
      actionList: []
    };
    handlePermissionsChange([...formData.permissions, newPermission]);
  };

  const removePermission = (index: number) => {
    const newPermissions = formData.permissions.filter((_, i) => i !== index);
    handlePermissionsChange(newPermissions);
  };

  const updatePermission = (index: number, field: keyof IPermission, value: any) => {
    const newPermissions = formData.permissions.map((permission, i) => {
      if (i === index) {
        return { ...permission, [field]: value };
      }
      return permission;
    });
    handlePermissionsChange(newPermissions);
  };

  const toggleAction = (permissionIndex: number, action: string) => {
    const permission = formData.permissions[permissionIndex];
    const actionList = permission.actionList.includes(action)
      ? permission.actionList.filter(a => a !== action)
      : [...permission.actionList, action];

    updatePermission(permissionIndex, 'actionList', actionList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t("roles.error.required_fields"));
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error(t("roles.form.permission_required"));
      return;
    }

    // Validate that all permissions have module and at least one action
    const hasInvalidPermission = formData.permissions.some(
      p => !p.module || p.actionList.length === 0
    );

    if (hasInvalidPermission) {
      toast.error(t("roles.form.permission_required"));
      return;
    }

    try {
      setLoading(true);

      if (!workspace?._id || !workspace?.currentUserId) {
        throw new Error("Workspace information not available");
      }

      const roleData = {
        name: formData.name.trim(),
        permissions: formData.permissions,
        createdBy: workspace.currentUserId,
        workspaceId: workspace._id,
      };

      await createRole(roleData);

      toast.success(t("roles.create_success"));
      
      // Clear form data
      setFormData({
        name: "",
        permissions: [],
      });
      setActiveTab(0);
      
      navigate("/roles");
    } catch (err: any) {
      toast.error(err.message || t("roles.error.create_failed"));
    } finally {
      setLoading(false);
    }
  };

  const moduleOptions = AVAILABLE_MODULES.map(module => ({
    value: module,
    label: t(`roles.modules.${module}`)
  }));

  const actionOptions = AVAILABLE_ACTIONS.map(action => ({
    value: action,
    label: t(`roles.actions.${action}`)
  }));

  return {
    formData,
    setFormData,
    loading,
    activeTab,
    setActiveTab,
    moduleOptions,
    actionOptions,
    handleInputChange,
    handlePermissionsChange,
    addPermission,
    removePermission,
    updatePermission,
    toggleAction,
    handleSubmit,
  }
}