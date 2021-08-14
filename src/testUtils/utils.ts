import path from "path";
import * as ts from "typescript";

function workaroundForPathBecauseIDnotKnowTSCompilersYet(path: string) {
    if (path.startsWith("/node_modules"))
        return `.${path}`;
    else
        return path;
}

export function getDiagnosticsForText(files: {
    [filename: string]: string
}) {
    const fileNames = Object.keys(files);
    const asts = fileNames.reduce((r, filename) => ({
        ...r,
        [filename]: ts.createSourceFile(filename, files[filename], ts.ScriptTarget.ESNext)
    }), {}) as { [key: string]: ts.SourceFile }
    const options: ts.CompilerOptions = {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
    };
    const nativeHost = ts.createCompilerHost(options);
    function fileIsMocked(filePath: string) {
        return fileNames.includes(filePath)
    }
    function cleanFilePath(f: string) {
        return f.replace(/^[^A-Za-z]/g, "");
    }
    const host: ts.CompilerHost = {
        fileExists: filePath => fileIsMocked(cleanFilePath(filePath)) || nativeHost.fileExists(workaroundForPathBecauseIDnotKnowTSCompilersYet(filePath)),
        directoryExists: dirPath => dirPath === "/" || nativeHost.directoryExists!(workaroundForPathBecauseIDnotKnowTSCompilersYet(dirPath)),
        getCurrentDirectory: () => "/",
        getDirectories: (s) => nativeHost.getDirectories!(s),
        getCanonicalFileName: fileName => fileName,
        getNewLine: () => "\n",
        getDefaultLibFileName: () => nativeHost.getDefaultLibFileName(options),
        getSourceFile: filePath => fileIsMocked(cleanFilePath(filePath)) ? asts[cleanFilePath(filePath)] : nativeHost.getSourceFile(workaroundForPathBecauseIDnotKnowTSCompilersYet(filePath), ts.ScriptTarget.Latest),
        readFile: filePath => fileIsMocked(cleanFilePath(filePath)) ? files[cleanFilePath(filePath)] : nativeHost.readFile(workaroundForPathBecauseIDnotKnowTSCompilersYet(filePath)),
        useCaseSensitiveFileNames: () => true,
        writeFile: () => { }
    };
    const program = ts.createProgram({
        options,
        rootNames: fileNames.concat(require.resolve("@types/jest/index.d.ts")),
        host
    });

    return ts.getPreEmitDiagnostics(program);
}