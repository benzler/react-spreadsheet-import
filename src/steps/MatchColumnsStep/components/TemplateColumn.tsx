import {
  Flex,
  Select,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
} from "@chakra-ui/react"
import { useRsi } from "../../../hooks/useRsi"
import type { Column } from "../MatchColumnsStep"
import { ColumnType } from "../MatchColumnsStep"
import { MatchIcon } from "./MatchIcon"
import { getFieldOptions } from "../utils/getFieldOptions"
import type { Fields } from "../../../types"

const SELECT_PLACEHOLDER = "Select column..."
const IGNORED_COLUMN_TEXT = "Column ignored"
const SUB_SELECT_PLACEHOLDER = "Select..."

const getAccordionTitle = <T extends string>(fields: Fields<T>, column: Column<T>) => {
  const fieldLabel = fields.find((field) => "value" in column && field.key === column.value)!.label
  return `Match ${fieldLabel} (${"matchedOptions" in column && column.matchedOptions.length} Unmatched)`
}

type TemplateColumnProps<T extends string> = {
  onChange: (val: T, index: number) => void
  onSubChange: (val: T, index: number, option: string | number) => void
  column: Column<T>
}

export const TemplateColumn = <T extends string>({ column, onChange, onSubChange }: TemplateColumnProps<T>) => {
  const { fields } = useRsi<T>()
  const isIgnored = column.type === ColumnType.ignored
  const isChecked = column.type === ColumnType.matched || column.type === ColumnType.matchedSelectOptions
  const isSelect = "matchedOptions" in column

  return (
    <Flex minH={10} w="100%" flexDir="column" justifyContent="center">
      {isIgnored ? (
        <Text fontSize="sm" lineHeight={5} fontWeight="normal" color="gray.400" px={4}>
          {IGNORED_COLUMN_TEXT}
        </Text>
      ) : (
        <>
          <Flex alignItems="center" minH={10} w="100%">
            <Select
              placeholder={SELECT_PLACEHOLDER}
              value={"value" in column ? column.value : undefined}
              onChange={(event) => onChange(event.target.value as T, column.index)}
            >
              {fields.map(({ label, key }) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </Select>
            <MatchIcon isChecked={isChecked} />
          </Flex>
          {isSelect && (
            <Flex width="100%">
              <Accordion allowMultiple width="100%">
                <AccordionItem border="none" py={1}>
                  <AccordionButton _hover={{ bg: "transparent" }} _focus={{ boxShadow: "none" }} px={0} py={4}>
                    <AccordionIcon />
                    <Box textAlign="left">
                      <Text color="blue.600" fontSize="sm" lineHeight={5} pl={1}>
                        {getAccordionTitle<T>(fields, column)}
                      </Text>
                    </Box>
                  </AccordionButton>
                  <AccordionPanel pb={4} display="flex" flexDir="column">
                    {column.matchedOptions.map((option) => (
                      <Box pl={2}>
                        <Text pt="0.375rem" pb={2} fontSize="md" lineHeight={6} fontWeight="medium" color="gray.700">
                          {option.entry}
                        </Text>
                        <Select
                          pb="0.375rem"
                          placeholder={SUB_SELECT_PLACEHOLDER}
                          onChange={(event) => onSubChange(event.target.value as T, column.index, option.entry!)}
                        >
                          {getFieldOptions(fields, column.value).map(({ label, value }) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}