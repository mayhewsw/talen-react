import React from "react";
import { Link } from "react-router-dom";
import { Card, ProgressBar, Button } from "react-bootstrap";
import { dataActions } from "../_actions";
import { useSelector } from "react-redux";

type Props = {
  datasetId: string;
  splitId: string;
  datasetStats: any;
  isAdmin: boolean;
};

function DatasetCard({ datasetId, splitId, datasetStats, isAdmin }: Props) {
  // const [state, dispatch] = useReducer(reducer, initialState);

  const saveToGithub = useSelector((_) => dataActions.saveToGithub);

  // return (dispatch: Dispatch<any>) => {
  //   dataService.saveToGithub(data).then(
  //     (status: string) => {
  //       dispatch({ type: SAVETOGITHUB_SUCCESS });
  //     },
  //     (error: any) => {
  //       console.log(error);
  //     }
  //   );
  // };

  // const saveToGithub = dataActions.saveToGithub;

  const language_map: any = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French",
    it: "Italian",
    nl: "Dutch",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ar: "Arabic",
    ja: "Japanese",
    ko: "Korean",
    he: "Hebrew",
    tr: "Turkish",
    vi: "Vietnamese",
    id: "Indonesian",
    fa: "Persian",
    hi: "Hindi",
    ur: "Urdu",
    ta: "Tamil",
    th: "Thai",
    sw: "Swahili",
    sv: "Swedish",
    sk: "Slovak",
    yo: "Yoruba",
    tl: "Tagalog",
    fi: "Finnish",
    hu: "Hungarian",
    cs: "Czech",
    pl: "Polish",
    bg: "Bulgarian",
    ro: "Romanian",
    da: "Danish",
    no: "Norwegian",
    el: "Greek",
    ceb: "Cebuano",
    mr: "Marathi",
  };

  const short_language = datasetId.split("_")[0];
  const language = language_map[short_language];
  const dataset_name = datasetId.split("_")[1].toUpperCase();

  const progress = datasetStats
    ? Math.floor((100 * datasetStats.numAnnotated) / datasetStats.numFiles)
    : 0;
  return (
    <Card style={{ width: "18rem" }} className="m-2">
      <Card.Body>
        <Card.Title>
          <Link to={`/dataset/${splitId}`}>{splitId}</Link>
        </Card.Title>
        {datasetStats && (
          <div>
            <ul>
              <li>Num Files: {datasetStats.numFiles}</li>
              <li>Num Annotated: {datasetStats.numAnnotated}</li>
              <li>Num Annotators: {datasetStats.annotators.length}</li>
            </ul>
            <div className="mb-3">
              {/* only include this next item if signed in as admin */}
              {/* click on this link, calls saveToGithub */}
              {isAdmin && (
                <Button
                  variant={
                    datasetStats.numFiles === datasetStats.numAnnotated
                      ? "outline-success"
                      : "outline-warning"
                  }
                  onClick={() =>
                    saveToGithub({
                      // dataset id looks like: en_ewt
                      // language_map maps en to English
                      repo_name: `UNER_${language}-${dataset_name}`,
                      dataset_key: splitId,
                    })
                  }
                >
                  Save to Github
                </Button>
              )}
            </div>

            <div className="mb-3">
              <ProgressBar
                variant="success"
                now={progress}
                label={`${progress}%`}
              />
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export { DatasetCard };
