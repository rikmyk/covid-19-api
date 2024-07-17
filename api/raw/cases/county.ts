import { NowResponse, NowRequest } from "@now/node";
import qs from "qs";

import { endpoints } from "../../../util/endpoints";
import { fetcher } from "../__util/fetcher";
import {
  createSortQuery,
  sortBy,
  createCountySortGroup,
} from "../__util/query";

const endpoint = endpoints.casesCounty;

export default async (req: NowRequest, res: NowResponse) => {
  const resultOffset =
    typeof req.query.resultOffset === "string"
      ? parseInt(req.query.resultOffset, 10)
      : 0;

  const field = Array.isArray(req.query.field)
    ? req.query.field[0]
    : req.query.field;

  if (typeof field !== "string" || !(field in sortBy)) {
    // Handle the error or set a default field
    return res.status(400).json({ error: "Invalid field parameter" });
  }

  const query = createSortQuery(createCountySortGroup(field), { resultOffset });
  const response = await fetcher(`${endpoint}?${qs.stringify(query)}`);
  const data = await response.json();
  res.json(data);
};
