import dayjs from "dayjs";
import "dayjs/locale/nb";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { TIMEZONE } from "@/common/app-config";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(localizedFormat);

dayjs.locale("nb");
dayjs.tz.setDefault(TIMEZONE);

export default dayjs;
