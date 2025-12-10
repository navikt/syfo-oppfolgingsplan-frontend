import dayjs from "dayjs";
import "dayjs/locale/nb";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { TIMEZONE_FOR_DISPLAY } from "@/common/app-config";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

dayjs.locale("nb");
dayjs.tz.setDefault(TIMEZONE_FOR_DISPLAY);

export default dayjs;
