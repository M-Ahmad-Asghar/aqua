import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { webinarReducer } from "./webinar";

const entityPersistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [],
};

const webReducers  = combineReducers({
    webinar:webinarReducer
})

const rootReducer = combineReducers({
  root: persistReducer(entityPersistConfig, webReducers),
});

export default rootReducer;
