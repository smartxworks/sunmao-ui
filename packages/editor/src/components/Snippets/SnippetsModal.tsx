import { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Select,
  FormControl,
  FormLabel,
  Switch,
  Box,
} from '@chakra-ui/react';
import { SpecWidget } from '@sunmao-ui/editor-sdk';
import { parseTypeBox } from '@sunmao-ui/shared';
import { render, helpers } from 'squirrelly';
import { EditorServices } from '../../types';
import { SchemaEditor } from '../CodeEditor';
import { AppModel } from '../../AppModel/AppModel';
import { genOperation } from '../../operations';

helpers.define('times', content => {
  let res = '';
  const times = content.params[0];
  for (let i = 0; i < times; i++) {
    res += content.exec(i);
  }
  return res;
});

const snippets = [
  JSON.stringify({
    version: 'example/v1',
    kind: 'Snippet',
    metadata: {
      name: 'Tabs',
    },
    spec: {
      components: `[
        {
          "id": "root",
          "type": "chakra_ui/v1/root",
          "properties": {},
          "traits": []
        },
        {
          "id": "tabs",
          "type": "chakra_ui/v1/tabs",
          "properties": {
            "tabNames": [
              ~~@times(tabNum) => val~~
                "Tab ~~ val + 1 ~~"~~@if(val < tabNum - 1)~~,~~/if~~
              ~~/times~~
            ],
            "initialSelectedTabIndex": 0
          },
          "traits": [
            ~~@if(container)~~
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "~~ container.id ~~",
                  "slot": "~~ container.slot ~~"
                }
              }
            }
            ~~/if~~
          ]
        }
      ]`,
      values: {
        type: 'object',
        properties: {
          tabNum: {
            type: 'number',
            default: 2,
          },
          container: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                default: 'root',
              },
              slot: {
                type: 'string',
                default: 'root',
              },
            },
            required: ['id', 'slot'],
          },
        },
      },
    },
  }),
  JSON.stringify({
    version: 'example/v1',
    kind: 'Snippet',
    metadata: {
      name: 'CRUD',
    },
    spec: {
      components: `[
        {
          "id": "fetchVolumes",
          "type": "core/v1/dummy",
          "properties": {},
          "traits": [
            {
              "type": "core/v1/fetch",
              "properties": {
                "name": "query",
                "url": "~~apiEndpoint~~/Volume",
                "method": "get",
                "lazy": false
              }
            }
          ]
        },
        {
          "id": "createVolume",
          "type": "core/v1/dummy",
          "properties": {},
          "traits": [
            {
              "type": "core/v1/fetch",
              "properties": {
                "url": "~~apiEndpoint~~/Volume",
                "method": "post",
                "lazy": true,
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": "{{ form.data }}",
                "bodyType": "json",
                "onComplete": [
                  {
                    "componentId": "$utils",
                    "method": {
                      "name": "chakra_ui/v1/openToast",
                      "parameters": {
                        "id": "createSuccessToast",
                        "title": "Congratulations",
                        "description": "Create Success",
                        "position": "bottom-right",
                        "duration": null,
                        "isClosable": true
                      }
                    }
                  },
                  {
                    "componentId": "editDialog",
                    "method": {
                      "name": "cancelDialog"
                    }
                  },
                  {
                    "componentId": "form",
                    "method": {
                      "name": "resetForm"
                    }
                  },
                  {
                    "componentId": "fetchVolumes",
                    "method": {
                      "name": "triggerFetch",
                      "parameters": "query"
                    },
                    "wait": {},
                    "disabled": "false"
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "deleteVolume",
          "type": "core/v1/dummy",
          "properties": {},
          "traits": [
            {
              "type": "core/v1/fetch",
              "properties": {
                "url": "~~apiEndpoint~~/Volume/{{ table.selectedItem ? table.selectedItem.id : '' }}",
                "method": "delete",
                "lazy": true,
                "onComplete": [
                  {
                    "componentId": "fetchVolumes",
                    "method": {
                      "name": "triggerFetch",
                      "parameters": "query"
                    },
                    "wait": {},
                    "disabled": "false"
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "root",
          "type": "chakra_ui/v1/root",
          "properties": {},
          "traits": []
        },
        {
          "id": "editDialog",
          "type": "chakra_ui/v1/dialog",
          "properties": {
            "title": "This is a dialog",
            "confirmButton": {
              "text": "保存",
              "colorScheme": "purple"
            },
            "cancelButton": {
              "text": "Cancel"
            },
            "disableConfirm": "{{ form.isFormInvalid }}"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "root",
                  "slot": "root"
                }
              }
            },
            {
              "type": "core/v1/event",
              "parsedType": {
                "version": "core/v1",
                "name": "event"
              },
              "properties": {
                "handlers": [
                  {
                    "type": "confirmDialog",
                    "componentId": "createVolume",
                    "method": {
                      "name": "triggerFetch"
                    },
                    "wait": {},
                    "disabled": false
                  },
                  {
                    "type": "cancelDialog",
                    "componentId": "editDialog",
                    "method": {
                      "name": "cancelDialog"
                    },
                    "wait": {},
                    "disabled": false
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "form",
          "type": "chakra_ui/v1/form",
          "properties": {
            "hideSubmit": true
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "editDialog",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "nameFormControl",
          "type": "chakra_ui/v1/formControl",
          "properties": {
            "label": "Name",
            "fieldName": "name",
            "isRequired": true
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "form",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "nameInput",
          "type": "chakra_ui/v1/input",
          "properties": {
            "defaultValue": "{{ table.selectedItem ? table.selectedItem.name : '' }}"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "nameFormControl",
                  "slot": "content"
                }
              }
            },
            {
              "type": "core/v1/validation",
              "properties": {
                "value": "{{ nameInput.value || '' }}",
                "maxLength": 10,
                "minLength": 2
              }
            }
          ]
        },
        {
          "id": "typeFormControl",
          "type": "chakra_ui/v1/formControl",
          "properties": {
            "label": "Type",
            "fieldName": "type"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "form",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "typeRadioGroup",
          "type": "chakra_ui/v1/radioGroup",
          "properties": {
            "defaultValue": "{{ table.selectedItem ? table.selectedItem.type : 'notSharing' }}"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "typeFormControl",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "radio1",
          "type": "chakra_ui/v1/radio",
          "properties": {
            "text": {
              "raw": "Volume",
              "format": "plain"
            },
            "value": "notSharing"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "typeRadioGroup",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "radio2",
          "type": "chakra_ui/v1/radio",
          "properties": {
            "text": {
              "raw": "Shared Volume",
              "format": "plain"
            },
            "value": "sharing",
            "size": "md"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "typeRadioGroup",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "sizeFormControl",
          "type": "chakra_ui/v1/formControl",
          "properties": {
            "label": "Capacity",
            "fieldName": "size",
            "isRequired": true
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "form",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "sizeInput",
          "type": "chakra_ui/v1/numberInput",
          "properties": {
            "defaultValue": "{{ table.selectedItem ? table.selectedItem.size : 0 }}",
            "min": 0,
            "max": 100,
            "step": 5,
            "precision": 2,
            "clampValueOnBlur": false,
            "allowMouseWheel": true
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "sizeFormControl",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "policyFormControl",
          "type": "chakra_ui/v1/formControl",
          "properties": {
            "label": "Policy",
            "fieldName": "policy"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "form",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "policySelect",
          "type": "chakra_ui/v1/select",
          "properties": {
            "defaultValue": "{{ table.selectedItem ? table.selectedItem.policy : '2thin' }}",
            "options": [
              {
                "value": "2thin",
                "label": "2 replicas，thin"
              },
              {
                "value": "3thin",
                "label": "3 replicas，thin"
              },
              {
                "value": "2thick",
                "label": "2 replicas，thick"
              },
              {
                "value": "3thick",
                "label": "3 replicas，thick"
              }
            ]
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "policyFormControl",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "isActiveFormControl",
          "type": "chakra_ui/v1/formControl",
          "properties": {
            "label": "Active",
            "fieldName": "isActive"
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "form",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "checkbox",
          "type": "chakra_ui/v1/checkbox",
          "properties": {
            "value": "isActive",
            "defaultIsChecked": "{{table.selectedItem ? !!table.selectedItem.isActive : false}}",
            "text": {
              "raw": "Active",
              "format": "plain"
            }
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "isActiveFormControl",
                  "slot": "content"
                }
              }
            }
          ]
        },
        {
          "id": "table",
          "type": "chakra_ui/v1/table",
          "properties": {
            "data": "{{ fetchVolumes.fetch.data }}",
            "majorKey": "id",
            "rowsPerPage": 5,
            "columns": [
              {
                "key": "id",
                "title": "ID",
                "type": "text"
              },
              {
                "key": "name",
                "title": "Name",
                "type": "text"
              },
              {
                "key": "type",
                "title": "Type",
                "type": "text",
                "displayValue": "{{$listItem.type === 'sharing' ? 'Shared Volume' : 'Volume'}}"
              },
              {
                "key": "size",
                "title": "Capacity",
                "type": "text",
                "displayValue": "{{$listItem.size}} GiB"
              },
              {
                "key": "policy",
                "title": "Policy",
                "type": "text"
              },
              {
                "key": "isActive",
                "title": "Active",
                "type": "text",
                "displayValue": "{{$listItem.isActive ? 'Yes' : 'No'}}"
              },
              {
                "key": "operation",
                "title": "",
                "type": "button",
                "buttonConfig": {
                  "text": "Delete",
                  "handlers": [
                    {
                      "componentId": "deleteVolume",
                      "method": {
                        "name": "triggerFetch"
                      }
                    }
                  ]
                }
              },
              {
                "key": "edit",
                "title": "",
                "type": "button",
                "buttonConfig": {
                  "text": "Edit",
                  "handlers": [
                    {
                      "componentId": "editDialog",
                      "method": {
                        "name": "openDialog",
                        "parameters": {
                          "title": "Edit Volume"
                        }
                      }
                    }
                  ]
                }
              }
            ]
          },
          "traits": [
            {
              "type": "core/v1/slot",
              "properties": {
                "container": {
                  "id": "root",
                  "slot": "root"
                }
              }
            }
          ]
        }
      ]`,
      values: {
        type: 'object',
        properties: {
          apiEndpoint: {
            title: 'API Endpoint',
            type: 'string',
            default: 'https://61373521eac1410017c18209.mockapi.io',
          },
        },
      },
    },
  }),
].map(s => JSON.parse(s));

function SnippetsModal({ services }: { services: EditorServices }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [preview, setPreview] = useState(false);
  const [sIdx, setSIdx] = useState<any>(0);
  const snippet = snippets[sIdx];
  const [values, setValues] = useState<any>(
    snippet.spec.values && parseTypeBox(snippet.spec.values)
  );
  const components = useMemo(() => {
    try {
      return JSON.parse(
        render(snippet.spec.components, values, {
          useWith: true,
          tags: ['~~', '~~'],
        })
      );
    } catch (error) {
      return String(error);
    }
  }, [snippet, values]);

  return (
    <>
      <Button colorScheme="blue" mr={3} onClick={onOpen} variant="outline">
        Snippets
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Snippets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" alignItems="center" justifyContent="flex-end">
              <FormLabel mb="0">Preview</FormLabel>
              <Switch
                checked={preview}
                onChange={e => setPreview(e.currentTarget.checked)}
              />
            </FormControl>
            {preview && (
              <SchemaEditor
                defaultCode={JSON.stringify(components, null, 2)}
                onChange={() => {
                  // readonly
                }}
              />
            )}
            {!preview && (
              <Box>
                <FormControl mt="2">
                  <FormLabel>Pick A Snippet</FormLabel>
                  <Select
                    value={sIdx}
                    onChange={e => {
                      const idx = parseInt(e.currentTarget.value);
                      setSIdx(idx);
                      setValues(parseTypeBox(snippets[idx].spec.values));
                    }}
                  >
                    {snippets.map((s, idx) => {
                      return (
                        <option key={idx} value={idx}>
                          {s.metadata.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                {Boolean(snippet.spec.values) && (
                  <FormControl mt="2">
                    <FormLabel>Values</FormLabel>
                    <SpecWidget
                      component={{} as any}
                      spec={snippet.spec.values}
                      value={values}
                      path={[]}
                      level={0}
                      onChange={newValue => {
                        setValues(newValue);
                      }}
                      services={services}
                    />
                  </FormControl>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                const { registry, eventBus } = services;

                eventBus.send(
                  'operation',
                  genOperation(registry, 'replaceApp', {
                    app: new AppModel(
                      services.appModelManager.appModel.toSchema().concat(components),
                      registry
                    ),
                  })
                );

                onClose();
              }}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SnippetsModal;
