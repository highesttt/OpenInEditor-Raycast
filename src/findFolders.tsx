import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
  Image,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { FileInfo } from "./interfaces/fileinfo";
import { Preferences } from "./interfaces/preferences";
import { folderCache, getCachedGitignoreFolders } from "./utils/ignore";
import { openFolderInEditor } from "./openInEditor";
import { extLangMap } from "./consts";

/**
 * Main function for the Raycast extension.\
 * \
 * Command to list folders containing .gitignore files.\
 * Allows users to open these folders in a custom editor.
 */
export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const { rootFolder, forceRefreshFolders } = prefs;
  const [searchText, setSearchText] = useState("");
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [cachedFolders, setCachedFolders] = useState<FileInfo[]>(
    folderCache?.folders || [],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: folderResults,
    isLoading,
    revalidate,
  } = useCachedPromise(
    async (root: string, force: boolean) => {
      setIsRefreshing(true);
      const folders = await getCachedGitignoreFolders(root, force);
      setIsRefreshing(false);
      setCachedFolders(folders);
      return folders;
    },
    [rootFolder, !!forceRefreshFolders],
    { initialData: cachedFolders },
  );

  const displayFolders =
    isLoading && cachedFolders.length > 0 ? cachedFolders : folderResults || [];

  return (
    <List
      isLoading={isLoading && cachedFolders.length === 0}
      isShowingDetail={isShowingDetail}
      searchBarPlaceholder={
        isRefreshing ? "Refreshing folders..." : "Search folders..."
      }
      onSearchTextChange={(searchText: string) =>
        setSearchText(searchText.toLowerCase())
      }
      throttle
    >
      <List.EmptyView
        title={
          searchText
            ? "No Folders Found"
            : isRefreshing
              ? "Refreshing..."
              : "Scan for Gitignore Folders"
        }
        description={
          searchText
            ? `No results for "${searchText}"`
            : isRefreshing
              ? "Refreshing folder list."
              : "Scanning for folders containing .gitignore."
        }
        icon={Icon.Folder}
      />
      {displayFolders
        .filter((f) => {
          const lowerSearchText = searchText.toLowerCase();

          if (!lowerSearchText.trim()) return true;

          const searchTerms = lowerSearchText.trim().split(/\s+/);

          return searchTerms.every((term) => {
            if (term.startsWith("@") || term.startsWith("folder:")) {
              const folderQuery = term.replace(/^(folder:|@)/, "");
              return f.commandline.toLowerCase().includes(folderQuery);
            }

            if (term.startsWith("#") || term.startsWith("lang:")) {
              const langQuery = term.replace(/^(lang:|#)/, "");

              if (
                langQuery.startsWith(".") ||
                Object.keys(extLangMap).some(
                  (ext) => ext.toLowerCase() === `.${langQuery.toLowerCase()}`,
                )
              ) {
                const normalizedExt = langQuery.startsWith(".")
                  ? langQuery
                  : `.${langQuery}`;
                return Object.entries(extLangMap).some(
                  ([ext, { language }]) => {
                    return (
                      ext.toLowerCase() === normalizedExt.toLowerCase() &&
                      f.language?.toLowerCase() === language.toLowerCase()
                    );
                  },
                );
              }

              return f.language?.toLowerCase().includes(langQuery);
            }

            return f.name.toLowerCase().includes(term);
          });
        })
        .map((folder) => (
          <List.Item
            key={folder.commandline}
            id={folder.commandline}
            title={require("path").basename(folder.commandline)}
            subtitle={folder.commandline}
            icon={
              folder.icon.trim().startsWith("<svg")
                ? {
                    source: {
                      dark: folder.icon,
                      light: folder.icon,
                    },
                  }
                : folder.icon
            }
            accessories={[{ text: folder.language || "Unknown" }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Open in Editor"
                    icon={Icon.Desktop}
                    onAction={() =>
                      openFolderInEditor(folder.commandline, folder.language)
                    }
                  />
                  <Action.CopyToClipboard
                    title="Copy Folder Path"
                    content={folder.commandline}
                  />
                  <Action
                    title="Refresh Folders"
                    icon={Icon.Repeat}
                    onAction={() => revalidate()}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
}
