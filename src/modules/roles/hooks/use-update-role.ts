import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IRoleFormData, IPermission, IRole } from "../interfaces";
import { AVAILABLE_MODULES, AVAILABLE_ACTIONS } from "../constants/roles.constants";

import { fetchRoleById } from "../api/fetch-roles";
import { updateRole } from "../api/update-role";

export const useUpdateRole = () => {
    const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [formData, setFormData] = useState<IRoleFormData>({
    name: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchRole = async () => {
      if (!id) {
        toast.error(t("roles.error.invalid_id"));
        navigate("/roles");
        return;
      }

      try {
        setLoadingData(true);
        const role: IRole = await fetchRoleById(id);
        
        setFormData({
          name: role.name,
          permissions: role.permissions || [],
        });
      } catch (err: any) {
        toast.error(err.message || t("roles.error.fetch_failed"));
        navigate("/roles");
      } finally {
        setLoadingData(false);
      }
    };

    fetchRole();
  }, [id, navigate, t]);

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

    if (!id) {
      toast.error(t("roles.error.invalid_id"));
      return;
    }

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

      const roleData = {
        name: formData.name.trim(),
        permissions: formData.permissions,
      };

      await updateRole(id, roleData);

      toast.success(t("roles.update_success"));
      navigate("/roles");
    } catch (err: any) {
      toast.error(err.message || t("roles.error.update_failed"));
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
    loading,
    loadingData,
    activeTab,
    setActiveTab,
    handleInputChange,
    handlePermissionsChange,
    addPermission,
    removePermission,
    updatePermission,
    toggleAction,
    handleSubmit,
    moduleOptions,
    actionOptions,
  }
}