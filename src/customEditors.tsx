import {
  Action,
  ActionPanel,
  Form,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { extLangMap } from "./consts";
import { getCustomEditors, setCustomEditors } from "./utils/storage";
import { CustomEditor } from "./interfaces/customeditor";

/**
 * Custom Editors component for managing user-defined editor commands.
 * Allows users to add, remove, and filter custom editors based on programming languages.
 */
export default function CustomEditors() {
  const [editors, setEditors] = useState<CustomEditor[]>([]);
  useEffect(() => {
    getCustomEditors().then(setEditors);
  }, []);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);

  /**
   * Handles the removal of a custom editor from the list.
   * @param index - The index of the editor to remove.
   */
  function handleRemoveEditor(index: number) {
    const updated = editors.filter((_, i) => i !== index);
    setEditors(updated);
    setCustomEditors(updated);
    showToast({
      style: Toast.Style.Success,
      title: "Custom Editor Removed",
    });
  }

  /**
   * Handles the addition of a new custom editor.
   * @param values - The form values containing programming language and command to run.
   */
  function handleAddEditor(values: { language: string; command: string }) {
    console.log(
      `[${new Date().toISOString()}] handleAddEditor called with:`,
      values,
    );
    const language = values.language.trim();
    let command = values.command.trim();
    if (!language || !command) {
      showToast({
        style: Toast.Style.Failure,
        title: "Missing Fields",
        message: "Both language and command are required.",
      });
      return;
    }
    command = command.replace(/"/g, '\"');
    const normalizedLanguage = language.toLowerCase();
    const filtered = editors.filter(
      (e) => e.language.toLowerCase() !== normalizedLanguage,
    );
    const newEditor: CustomEditor = {
      language: language,
      command: command,
    };
    const updated = [...filtered, newEditor];
    setEditors(updated);
    setCustomEditors(updated)
      .then(() => {
        showToast({
          style: Toast.Style.Success,
          title: "Custom Editor Added",
          message: `${language}: ${command}`,
        });
        setShowForm(false);
      })
      .catch((e) => {
        showToast({
          style: Toast.Style.Failure,
          title: "Error Adding Editor",
          message: String(e),
        });
      });
  }

  const filteredEditors = editors.filter(
    (e) =>
      e.language.toLowerCase().includes(searchText) ||
      e.command.toLowerCase().includes(searchText),
  );

  if (showForm) {
    const langIconMap: Record<string, Icon | string> = {};
    Object.values(extLangMap).forEach(({ language, icon }) => {
      langIconMap[language] = icon;
    });
    const langList = Object.keys(langIconMap);
    return (
      <Form
        navigationTitle="Add Custom Editor"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Add Custom Editor"
              onSubmit={handleAddEditor}
            />
            <Action title="Cancel" onAction={() => setShowForm(false)} />
          </ActionPanel>
        }
      >
        <Form.Dropdown id="language" title="Programming Language">
          {langList.map((lang) => (
            <Form.Dropdown.Item
              key={lang}
              value={lang}
              title={lang}
              icon={langIconMap[lang]}
            />
          ))}
        </Form.Dropdown>
        <Form.TextField
          id="command"
          title="Editor Command"
          placeholder="e.g. code %s"
        />
      </Form>
    );
  }

  return (
    <List
      searchBarPlaceholder="Filter by language or command..."
      onSearchTextChange={setSearchText}
      throttle
      actions={
        <ActionPanel>
          <Action
            title="Add Custom Editor"
            icon={Icon.Plus}
            onAction={() => setShowForm(true)}
          />
        </ActionPanel>
      }
    >
      <List.EmptyView
        title={searchText ? "No Custom Editors Found" : "No Custom Editors"}
        description={
          searchText
            ? `No results for "${searchText}"`
            : "Add a custom editor for a language."
        }
        icon={Icon.Gear}
      />
      {filteredEditors.map((editor, idx) => {
        const icon =
          Object.values(extLangMap).find((v) => v.language === editor.language)
            ?.icon ?? Icon.Gear;
        return (
          <List.Item
            key={editor.language + editor.command}
            title={editor.language}
            subtitle={editor.command}
            icon={icon}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Remove Custom Editor"
                    icon={Icon.Trash}
                    onAction={() => handleRemoveEditor(idx)}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
