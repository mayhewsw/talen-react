let alldata = {
  dataset1: {
    doc1: {
      sentences: [
        "Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),
        "New York City is in New York , which is in the United States .".split(
          " "
        ),
        "Other states in the United States include Montana , Indiana , and New Jersey .".split(
          " "
        ),
        "England draw dull Denmark game .".split(" "),
      ],
      labels: [
        "OOOOOOOOOOO".split(""),
        "OOOOOOOOOOOOOOO".split(""),
        "OOOOOOOOOOOOOOO".split(""),
        "OOOOOO".split(""),
      ],
    },
    doc2: {
      sentences: [
        "Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),
        "New York City is in New York , which is in the United States .".split(
          " "
        ),
        "England draw dull Denmark game .".split(" "),
      ],
      labels: [
        "OOOOOOOOOOO".split(""),
        "OOOOOOOOOOOOOOO".split(""),
        "OOOOOO".split(""),
      ],
    },
  },
  news_set: {
    news1: {
      sentences: [
        "Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),
        "New York City is in New York , which is in the United States .".split(
          " "
        ),
        "England draw dull Denmark game .".split(" "),
      ],
      labels: [
        "OOOOOOOOOOO".split(""),
        "OOOOOOOOOOOOOOO".split(""),
        "OOOOOO".split(""),
      ],
    },
    news2: {
      sentences: [
        "Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),
        "New York City is in New York , which is in the United States .".split(
          " "
        ),
        "England draw dull Denmark game .".split(" "),
      ],
      labels: [
        "OOOOOOOOOOO".split(""),
        "OOOOOOOOOOOOOOO".split(""),
        "OOOOOO".split(""),
      ],
    },
  },
};

console.log(alldata);

export function configureFakeBackend() {
  let realFetch = window.fetch;
  window.fetch = function (url, opts) {
    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(() => {
        // authenticate
        if (url.endsWith("/users/authenticate") && opts.method === "POST") {
          let responseJson = {
            id: 0,
            username: "test_user",
            firstName: "Test",
            lastName: "User",
          };
          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(responseJson)),
          });

          return;
        }

        if (url.endsWith("/datasetlist") && opts.method === "GET") {
          let responseJson = {
            datasetIDs: Object.keys(alldata),
          };
          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(responseJson)),
          });
          return;
        }

        if (url.indexOf("loaddataset") > -1 && opts.method === "GET") {
          let urlParts = url.split("?");
          const urlParams = new URLSearchParams(urlParts[urlParts.length - 1]);
          let dataset = urlParams.get("dataset");

          let responseJson = {
            documentIDs: Object.keys(alldata[dataset]),
            annotatedDocumentIDs: [],
          };
          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(responseJson)),
          });
          return;
        }

        if (url.indexOf("loaddoc") > -1 && opts.method === "GET") {
          let urlParts = url.split("?");
          const urlParams = new URLSearchParams(urlParts[urlParts.length - 1]);
          let dataset = urlParams.get("dataset");
          let docid = urlParams.get("docid");

          let responseJson = alldata[dataset][docid];
          responseJson.labelset = {
            PER: "yellow",
            LOC: "yellowgreen",
            ORG: "lightblue",
            O: "transparent",
          };

          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(responseJson)),
          });
          return;
        }

        if (url.indexOf("savedoc") > -1) {
          resolve({ ok: true });
          return;
        }

        // pass through any requests not handled above
        realFetch(url, opts).then((response) => resolve(response));
      }, 10);
    });
  };
}
