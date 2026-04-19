// StatsTable.tsx
import type { StatRow } from "../../utils/groupExpenses";
import type { GroupField } from "../../types";
import { isSafari } from "../../utils/isSafari";
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";

type Props = {
  field: GroupField, 
  rows: StatRow[],
  totalCount: number,
  grandTotal: number
};

const groupFieldLabels: Record<GroupField, TranslationKey> = {
  title: "title",
  category: "category",
  location: "place",
};

export const StatsTable = ({ field, rows, totalCount, grandTotal }: Props) => 
{            
  const { t } = useTranslation()

  return (
    <div className="border border-(--input-border) rounded-lg"> 
      <div className="flex sticky z-20 border-b border-(--input-border)">
        <span className={
          isSafari
            ? "first-column"
            : "first-column ml-1"
        }
          >{t(groupFieldLabels[field])}</span>
        <span className="second-column">{t('quantity')}</span>
        <span className={
          isSafari
            ? "third-column"
            : "third-column mr-1"
        }
        >{t('amount')}</span>
      </div>
      <div className="h-70 pl-1 overflow-y-auto relative [scrollbar-gutter:stable]">
        <table className="w-full table-fixed border-collapse text-sm">
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key} className="odd:bg-(--bg-secondary) even:bg-(--checked-option)">
                <td className="p-1 text-(--text) w-[46.5%] truncate rounded-l-md">{row.key}</td>
                <td className="p-1 text-(--text) text-center w-[16%]">{row.count}</td>
                <td className="p-1 text-(--text) text-right w-[31.5%] rounded-r-md">{row.total}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 10 - rows.length) }).map((_, index) => (
          <tr key={`empty-${index}`} className="odd:bg-(--bg-secondary) even:bg-(--checked-option)">
            <td className="p-1 truncate rounded-l-md">&nbsp;</td>
            <td className="p-1 text-center">&nbsp;</td>
            <td className="p-1 text-right rounded-r-md">&nbsp;</td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>
      <div className="flex sticky bottom-0 z-20 border-t border-(--input-border)">
        <span className={
          isSafari
            ? "first-column"
            : "first-column ml-1"
          }
        >{t('total')}</span>
        <span className="second-column">{totalCount}</span>
        <span className={
          isSafari
            ? "third-column"
            : "third-column mr-1"
          }
        >{grandTotal}</span>
      </div>
    </div>
  )
}