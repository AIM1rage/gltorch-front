import { NoticeProps } from "@/components/ui/notice";

type NoticeStore = {
  notices: NoticeProps[];
  addNotice: (notice: NoticeProps) => void;
  removeNotice: (notice: NoticeProps) => void;
};
