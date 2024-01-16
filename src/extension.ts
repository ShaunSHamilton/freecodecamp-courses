import { commands, ExtensionContext, window } from "vscode";
import openCourse from "./commands/open-course";
import runCourse from "./commands/run-course";
import developCourse from "./commands/develop-course";
import createNewCourse from "./commands/create-new-course";
import collapse from "./commands/collapse";
import { ProjectsProvider } from "./view";
import { getConfig } from "./usefuls";

export async function activate(context: ExtensionContext) {
  // If config is set to automatically open course on startup:
  try {
    const config = await getConfig();
    if (config.workspace?.autoStart) {
      runCourse();
    }
  } catch (e) {
    console.debug(e);
  }
  console.log("freeCodeCamp Courses extension is now active!");

  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.openCourse", async () => {
      openCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.runCourse", async () => {
      runCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.developCourse", async () => {
      developCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.collapse", async () => {
      collapse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand(
      "freecodecamp-courses.shutdownCourse",
      async () => {
        shutdownCourse();
      }
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      "freecodecamp-courses.createNewCourse",
      async () => {
        createNewCourse();
      }
    )
  );

  const superblockJson = await fetch(
    "https://www.freecodecamp.org/curriculum-data/v1/available-superblocks.json"
  );
  const availableSuperblocks = await superblockJson.json();
  const projectsView = new ProjectsProvider(availableSuperblocks.superblocks);
  window.registerTreeDataProvider("freecodecamp-courses", projectsView);
  // context.subscriptions.push(workspacesExplorerView);
}

function shutdownCourse() {
  // End all running terminal processes
  window.terminals.forEach((terminal) => {
    terminal.dispose();
  });

  // This is a bit of a hack to close the Simple Browser window
  // So, it might not work well.
  try {
    window.visibleTextEditors.forEach((editor) => {
      window.showTextDocument(editor.document).then((_) => {
        return commands.executeCommand("workbench.action.closeActiveEditor");
      });
    });
  } catch {}
}

// this method is called when your extension is deactivated
export function deactivate() {}
