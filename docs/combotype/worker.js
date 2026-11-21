importScripts("wasm_exec.js");

let core;
const ready = (async () => {
  const go = new Go();
  const response = await fetch("engine.wasm");
  if (!response.ok) throw new Error("The writing engine could not load.");
  const binary = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(binary, go.importObject);
  go.run(instance).catch(error => postMessage({ error: error.message }));
  core = self.comboTypeCore;
  if (!core) throw new Error("The writing engine did not start.");
  postMessage({ ready: true });
})();

onmessage = async ({ data: { id, request } }) => {
  try {
    await ready;
    const result = JSON.parse(core(JSON.stringify(request)));
    postMessage({ id, ...result });
  } catch (error) {
    postMessage({ id, error: error.message });
  }
};
ready.catch(error => postMessage({ error: error.message }));
