function App() {
  const handler = async () => {
    const tabs = await browser.tabs.query({ currentWindow: true, active: true });
    console.log(tabs);

    for (const tab of tabs) {
      if (!tab.id) {
        continue;
      }
      const r = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/content-scripts/content.js'],
      });
      console.log('popup runscript: ', r);

      const response = await browser.tabs.sendMessage(tab.id, 'from popup');
      console.log('popup message received: ', response);
    }
  };

  return (
    <button type="button" onClick={handler}>
      Click!
    </button>
  );
}

export default App;
