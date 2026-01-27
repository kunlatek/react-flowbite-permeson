import React, { useEffect, useRef } from "react";
import axios from "axios";
import {
    KuInput, KuButton, KuSelect, KuAutocomplete, KuArray,
    KuWysiwyg
} from "@/components/ku-components";
import { FileManager } from "@/components/common";
import { showField, applyMask } from "@/utils/form.utils";
import type { IFileItem } from "@/components/common";

interface IFormElementRendererProps {
    element: any;
    context?: string;
    itemValue?: any;
    index?: any;
    formData: any;
    errors: Record<string, string>;
    handleInputChange: (name: string, value: any) => void;
    handleFilesChange?: (field: string, files: IFileItem[]) => void;
    handleFilesSelect?: (field: string, files: File[]) => void;
    files?: { [key: string]: IFileItem[] };
    isPending?: boolean;
    t: (key: string) => string;
    apiRequestTimeouts: React.MutableRefObject<{ [key: string]: NodeJS.Timeout }>;
    handleApiRequest?: (element: any, value: string, context: string, itemValue?: any, index?: number) => Promise<void>;
    isMobile?: boolean;
}

export const createHandleApiRequest = (
    formData: any,
    handleInputChange: (name: string, value: any) => void,
    apiRequestTimeouts: React.MutableRefObject<{ [key: string]: NodeJS.Timeout }>,
    fillFormByApiResponse: (form: any, apiResponse: any, formFieldsFilledByApiResponse: any[]) => any
) => {
    return async (element: any, value: string, context: string, itemValue?: any, index?: number) => {
        if (!element.apiRequest || !value) return;

        const dataForCondition = context === 'item' && itemValue && (index !== undefined && index !== null)
            ? itemValue[index]
            : formData;

        if (element.apiRequest.conditions?.form) {
            const condition = element.apiRequest.conditions.form;
            if (condition.elements && !showField(dataForCondition, condition.elements)) {
                return;
            }
        }

        const timeoutKey = `${element.name}-${context}-${index || 'main'}`;

        if (apiRequestTimeouts.current[timeoutKey]) {
            clearTimeout(apiRequestTimeouts.current[timeoutKey]);
        }

        apiRequestTimeouts.current[timeoutKey] = setTimeout(async () => {
            try {
                let url = element.apiRequest.endpoint;

                if (element.apiRequest.paramType === 'path') {
                    url = `${url}${value}`;
                } else if (element.apiRequest.paramType === 'query') {
                    const separator = url.includes('?') ? '&' : '?';
                    url = `${url}${separator}${value}`;
                }

                const response = await axios.get(url);
                const apiData = response.data;

                if (element.apiRequest.formFieldsFilledByApiResponse) {
                    if (context === 'item') {
                        const currentArrayValue = itemValue;
                        const updatedArrayValue = fillFormByApiResponse(
                            currentArrayValue[index || 0],
                            apiData,
                            element.apiRequest.formFieldsFilledByApiResponse
                        );
                        currentArrayValue[index || 0] = updatedArrayValue;
                        handleInputChange(element.parentArrayName, currentArrayValue);
                    } else {
                        const updatedForm = fillFormByApiResponse(
                            { ...formData },
                            apiData,
                            element.apiRequest.formFieldsFilledByApiResponse
                        );
                        Object.keys(updatedForm).forEach((key) => {
                            if (updatedForm[key] !== formData[key]) {
                                handleInputChange(key, updatedForm[key]);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching data from external API:', error);
            }
        }, 500);
    };
};

export const createRenderElement = (
    props: IFormElementRendererProps
): React.ReactElement | null => {
    const {
        element,
        context = 'formData',
        itemValue,
        index,
        formData,
        errors,
        handleInputChange,
        handleFilesChange,
        handleFilesSelect,
        files,
        isPending = false,
        t,
        handleApiRequest,
        isMobile = false
    } = props;

    const errorContext = errors[element.name];
    const getCurrentValue = () => {
        const value = context === 'item'
            ? itemValue?.[index]?.[element.name]
            : formData[element.name];
        if (element.type === 'select' && (element.dataType === 'integer' || element.dataType === 'number' || element.dataType === 'decimal' || element.dataType === 'numeric' || element.dataType === 'float' || element.dataType === 'double' || element.dataType === 'real')) {
            return value ?? null;
        }
        return value ?? '';
    };
    const currentValue = getCurrentValue();

    const condition = element.conditions?.form;
    const dataForCondition = context === 'item' && itemValue && (index !== undefined && index !== null)
        ? itemValue[index]
        : formData;
    if (condition && condition.elements && !showField(dataForCondition, condition.elements)) {
        return null;
    }

    if (element.dataType === 'wysiwyg') {
        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                <KuWysiwyg
                    key={element.name}
                    id={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    testId={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    label={element.label}
                    name={element.name}
                    value={currentValue}
                    onChange={(e: any, html: string) => {
                        if (context === 'item') {
                            const currentArrayValue = itemValue;
                            currentArrayValue[index][element.name] = html;

                            if (element.elementsToClearOnValueChange) {
                                element.elementsToClearOnValueChange.forEach((elementName: string) => {
                                    currentArrayValue[index][elementName] = null;
                                });
                            }
                            handleInputChange(element.parentArrayName, currentArrayValue);
                        } else {
                            handleInputChange(element.name, html);

                            if (element.elementsToClearOnValueChange) {
                                element.elementsToClearOnValueChange.forEach((elementName: string) => {
                                    handleInputChange(elementName, null);
                                });
                            }
                        }
                    }}
                />
            </div>
        );
    } else if (element.type === 'input') {
        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                <KuInput
                    key={element.name}
                    id={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    testId={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    label={element.label}
                    name={element.name}
                    dataType={element.dataType}
                    placeholder={element.placeholder || ''}
                    value={currentValue}
                    onChange={async (e: any) => {
                        const newValue = element.maskRegex ? applyMask(e.target.value, element.maskRegex) : e.target.value;

                        if (context === 'item') {
                            const currentArrayValue = itemValue;
                            currentArrayValue[index][element.name] = newValue;
                            handleInputChange(element.parentArrayName, currentArrayValue);

                            if (element.apiRequest && handleApiRequest) {
                                await handleApiRequest(element, newValue, context, currentArrayValue, index);
                            }
                        } else {
                            handleInputChange(element.name, newValue);

                            if (element.apiRequest && handleApiRequest) {
                                await handleApiRequest(element, newValue, context);
                            }
                        }
                    }}
                    isRequired={element.isRequired || false}
                    error={errorContext}
                    tooltip={element.tooltip || ''}
                    isDisabled={isPending || element.isDisabled}
                />
            </div>
        );
    } else if (element.type === 'select') {
        const onChange = (name: string, value: any) => {
            if (context === 'item') {
                const currentArrayValue = itemValue;
                currentArrayValue[index][element.name] = value;
                if (element.elementsToClearOnValueChange) {
                    element.elementsToClearOnValueChange.forEach((elementName: string) => {
                        currentArrayValue[index][elementName] = null;
                    });
                }
                handleInputChange(element.parentArrayName, currentArrayValue);
            } else {
                handleInputChange(element.name, value);
                if (element.elementsToClearOnValueChange) {
                    element.elementsToClearOnValueChange.forEach((elementName: string) => {
                        handleInputChange(elementName, null);
                    });
                }
            }

        }

        const SelectWithDefault = () => {
            const hasSetDefault = useRef(false);
            const isInitialMount = useRef(true);

            useEffect(() => {
                if (isInitialMount.current) {
                    isInitialMount.current = false;
                    const value = context === 'item'
                        ? itemValue?.[index]?.[element.name]
                        : formData[element.name];

                    const fieldExists = context === 'item'
                        ? (itemValue?.[index]?.hasOwnProperty(element.name))
                        : formData.hasOwnProperty(element.name);

                    if (!fieldExists) {
                        const computedValue = (element.dataType === 'integer' || element.dataType === 'number' || element.dataType === 'decimal' || element.dataType === 'numeric' || element.dataType === 'float' || element.dataType === 'double' || element.dataType === 'real')
                            ? (value ?? null)
                            : (value ?? '');

                        if (!computedValue && computedValue !== 0 && computedValue !== false) {
                            const selectedOption = element.options?.find((option: any) => option.isSelected);
                            if (selectedOption && !hasSetDefault.current) {
                                hasSetDefault.current = true;
                                onChange(element.name, selectedOption.value);
                            }
                        }
                    }
                }
            }, []);

            return (
                <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                    <KuSelect
                        key={element.name}
                        id={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                        testId={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                        label={element.label}
                        name={element.name}
                        options={element.options || []}
                        value={currentValue}
                        onChange={onChange}
                        isMultiple={element.isMultiple || false}
                        isRequired={element.isRequired || false}
                        error={errorContext}
                        tooltip={element.tooltip || ''}
                        isDisabled={isPending || element.isDisabled}
                    />
                </div>
            );
        };

        return <SelectWithDefault />;
    } else if (element.type === 'autocomplete') {
        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                <KuAutocomplete
                    key={element.name}
                    id={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    testId={`field-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    label={element.label}
                    name={element.name}
                    optionsApi={element.optionsApi || {}}
                    value={currentValue}
                    onChange={(name: string, value: any) => {
                        if (context === 'item') {
                            const currentArrayValue = itemValue;
                            currentArrayValue[index][element.name] =
                                Array.isArray(value) ?
                                    value.map((item: any) => typeof item === 'object' ? item.value : item)
                                    : value?.value;

                            if (element.elementsToClearOnValueChange) {
                                element.elementsToClearOnValueChange.forEach((elementName: string) => {
                                    currentArrayValue[index][elementName] = null;
                                });
                            }
                            handleInputChange(element.parentArrayName, currentArrayValue);
                        } else {
                            handleInputChange(element.name, value);
                            if (element.elementsToClearOnValueChange) {
                                element.elementsToClearOnValueChange.forEach((elementName: string) => {
                                    handleInputChange(elementName, null);
                                });
                            }
                        }
                    }}
                    isMultiple={element.isMultiple || false}
                    isRequired={element.isRequired || false}
                    error={errorContext}
                    tooltip={element.tooltip || ''}
                    isDisabled={isPending || element.isDisabled}
                    formState={formData}
                    type={element.dataType}
                    dataType={element.dataType}
                />
            </div>
        );
    } else if (element.type === 'file') {
        if (!handleFilesChange || !handleFilesSelect || !files) {
            return null;
        }

        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: '10px' }}>
                <FileManager
                    key={`${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    files={files[element.name]}
                    onFilesChange={(files: IFileItem[]) => handleFilesChange(element.name, files)}
                    onFilesSelect={(files: File[]) => handleFilesSelect(element.name, files)}
                    isUploading={isPending}
                    disabled={isPending || element.isDisabled}
                    label={element.label}
                    accept={element.storageConfig.visibility === 'public' ? 'image/*' : '*/*'}
                />
            </div>
        );
    } else if (element.type === 'array') {
        const lastElementsOfRowIndex: any[] = []
        element.elements.forEach((el: any, index: number) => (el.isLastElementOfRow ? lastElementsOfRowIndex.push(index) : null));
        const elements = new Array(lastElementsOfRowIndex.length).fill([]).map((el: any, index: number) => element.elements.slice((lastElementsOfRowIndex[index - 1] ?? -1) + 1, lastElementsOfRowIndex[index] + 1));

        const renderItem = (item: any, itemIndex: number, handleItemChange: any, handleRemoveItem: any) => (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                {elements.map((el: any) => (
                    <div key={el.name} className={`${isMobile ? '' : 'flex'} gap-4`}>
                        {el.map((el: any) => (
                            createRenderElement({
                                ...props,
                                element: el,
                                context: 'item',
                                itemValue: formData[element.name],
                                index: itemIndex,
                                formData: formData[element.name][itemIndex]
                            })
                        ))}
                    </div>
                ))}
                <div className="mt-4">
                    <KuButton
                        id={`remove-${element.name}-item-${itemIndex}`}
                        testId={`btn-remove-${element.name}-${itemIndex}`}
                        size="xs"
                        variant="danger"
                        onClick={() => handleRemoveItem(itemIndex)}
                        isDisabled={isPending || element.isDisabled}
                        type="button"
                        label={t("kuArray.remove_item")}
                        actionType="button"
                    >
                        {t("kuArray.remove_item")}
                    </KuButton>
                </div>
            </div>
        );

        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                <KuArray
                    key={element.id}
                    id={`array-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    testId={`array-${element.name}${index || index === 0 ? `-${index}` : ''}`}
                    title={element.label}
                    items={formData[element.name] || []}
                    onItemsChange={(items: any[]) => handleInputChange(element.name, items)}
                    addItem={(item: any) => formData[element.name] = [...(formData[element.name] ?? []), item]}
                    removeItem={(index: number) => formData[element.name].splice(index, 1)}
                    defaultNewItem={element.elements.reduce((acc: any, el: any) => {
                        acc[el.name] = '';
                        return acc;
                    }, {})}
                    renderItem={renderItem}
                />
            </div>
        );
    } else if (element.type === 'fieldset') {
        const lastElementsOfRowIndex: any[] = []
        element.elements.forEach((el: any, index: number) => (el.isLastElementOfRow ? lastElementsOfRowIndex.push(index) : null));
        const elements = new Array(lastElementsOfRowIndex.length).fill([]).map((el: any, index: number) => element.elements.slice((lastElementsOfRowIndex[index - 1] ?? -1) + 1, lastElementsOfRowIndex[index] + 1));
        return (
            <div style={{ width: `${isMobile ? '100' : (element.space ?? 4) * 25}%`, marginTop: isMobile ? '10px' : '' }}>
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-xs text-gray-500 dark:text-white">{element.title}</legend>
                    {elements.map((el: any) => (
                        <div key={el.name} className={`${isMobile ? '' : 'flex'} gap-4`}>
                            {el.map((el: any) => (
                                createRenderElement({
                                    ...props,
                                    element: el,
                                    context: context,
                                    itemValue: itemValue || formData,
                                    index
                                })
                            ))}
                        </div>
                    ))}
                </fieldset>
            </div>
        );
    }

    return null;
};

