import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const dayjsExt = dayjs;
dayjsExt.extend(relativeTime);

export default dayjsExt;
