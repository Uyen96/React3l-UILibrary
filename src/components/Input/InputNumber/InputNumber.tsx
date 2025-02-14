import classNames from "classnames";
import React, { ReactSVGElement, RefObject } from "react";
import { CloseFilled16 } from "@carbon/icons-react";
import "./InputNumber.scss";
import { ReactNode } from "react";
import { BORDER_TYPE } from "config/enum";

export const DECIMAL: string = "DECIMAL";
export const LONG: string = "LONG";

interface InputNumberAction {
  name?: string;
  action?: any;
}

export interface InputNumberProps {
  label?: string;
  isRequired?: boolean;
  type?: BORDER_TYPE;
  floatLabel?: boolean;
  isMaterial?: boolean;
  value?: number;
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
  allowPositive?: boolean;
  error?: string;
  numberType?: string;
  isReverseSymb?: boolean;
  decimalDigit?: number;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  action?: InputNumberAction;
  isSmall?: boolean;
  onChange?: (T: number) => void;
  onEnter?: (T: number) => void;
  onBlur?: (T: number) => void;
}

function InputNumber(props: InputNumberProps) {
  const {
    action,
    label,
    isRequired,
    type,
    prefix,
    suffix,
    value,
    allowPositive,
    numberType,
    decimalDigit,
    isReverseSymb,
    placeHolder,
    className,
    disabled,
    min,
    max,
    isSmall,
    onChange,
    onEnter,
    onBlur,
  } = props;

  const [internalValue, setInternalValue] = React.useState<string>("");

  const inputRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
    null
  );

  const buildRegex = React.useCallback(() => {
    var regExDecimal = "";
    var regExString = "";
    for (let i = 1; i <= decimalDigit; i++) {
      regExDecimal += "\\d";
    }
    if (isReverseSymb) {
      regExString = "(\\d)(?=(?:\\d{3})+(?:,|$))|(," + regExDecimal + "?)\\d*$";
    } else {
      regExString =
        "(\\d)(?=(?:\\d{3})+(?:\\.|$))|(\\." + regExDecimal + "?)\\d*$";
    }
    return new RegExp(regExString, "g");
  }, [decimalDigit, isReverseSymb]);

  const formatString = React.useCallback(
    (inputValue: string): string => {
      const newRegEx = buildRegex();
      if (isReverseSymb) {
        switch (numberType) {
          case DECIMAL:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9,-]/g, "")
                .replace(",", "x")
                .replace(/,/g, "")
                .replace("x", ",")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue
                .replace(/[^0-9,]/g, "")
                .replace(",", "x")
                .replace(/,/g, "")
                .replace("x", ",");
            }
            return inputValue.replace(newRegEx, (m, s1, s2) => {
              return s2 || s1 + ".";
            });
          default:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9-]/g, "")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue.replace(/[^0-9]/g, "");
            }
            return inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      } else {
        switch (numberType) {
          case DECIMAL:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9.-]/g, "")
                .replace(".", "x")
                .replace(/\./g, "")
                .replace("x", ".")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue
                .replace(/[^0-9.]/g, "")
                .replace(".", "x")
                .replace(/\./g, "")
                .replace("x", ".");
            }
            return inputValue.replace(newRegEx, (m, s1, s2) => {
              return s2 || s1 + ",";
            });
          default:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9-]/g, "")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue.replace(/[^0-9]/g, "");
            }
            return inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    },
    [isReverseSymb, numberType, buildRegex, allowPositive]
  );

  const parseNumber = React.useCallback(
    (value: string): [number, boolean] => {
      var isOutOfRange, number, stringValue;
      if (value) {
        if (isReverseSymb) {
          stringValue = value.replace(/[,.]/g, (m) => (m === "." ? "," : "."));
          stringValue = stringValue.replace(/,/g, "");
        } else {
          stringValue = value.replace(/,/g, "");
        }
        switch (numberType) {
          case DECIMAL:
            isOutOfRange = stringValue.length > 21 ? true : false;
            number = parseFloat(stringValue);
            return [number, isOutOfRange];
          default:
            isOutOfRange = stringValue.length > 17 ? true : false;
            number = parseInt(stringValue);
            return [number, isOutOfRange];
        }
      } else {
        return [null, false];
      }
    },
    [numberType, isReverseSymb]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const stringValue = formatString(event.target.value);
      const [numberValue, isOutOfRange] = parseNumber(stringValue);
      if (!isOutOfRange) {
        setInternalValue(stringValue);
        if (typeof onChange === "function") {
          onChange(numberValue);
        }
      }
    },
    [formatString, parseNumber, onChange]
  );

  const handleClearInput = React.useCallback(
    (event: React.MouseEvent<ReactSVGElement, MouseEvent>) => {
      setInternalValue("");
      inputRef.current.focus();
      if (typeof onChange === "function") {
        onChange(null);
        return;
      }
      if (typeof onBlur === "function") {
        onBlur(null);
        return;
      }
      if (typeof onEnter === "function") {
        onEnter(null);
        return;
      }
    },
    [onBlur, onChange, onEnter]
  );

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (typeof onEnter === "function") {
          onEnter(parseNumber(event.currentTarget.value)[0]);
        }
      }
    },
    [onEnter, parseNumber]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (typeof onBlur === "function") {
        onBlur(parseNumber(event.currentTarget.value)[0]);
      }
    },
    [onBlur, parseNumber]
  );

  React.useEffect(() => {
    if (value) {
      var stringValue = "" + value;
      if (isReverseSymb) {
        stringValue = stringValue.replace(/\./g, ",");
      }
      setInternalValue(formatString(stringValue));
    } else {
      setInternalValue("");
    }
  }, [value, formatString, isReverseSymb]);

  return (
    <div className={classNames("input-number__wrapper", className)}>
      <div className="input-number__label m-b--xxxs">
        {type !== BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            className={classNames("component__title", {
              "component__title--disabled": disabled,
            })}
          >
            {label}
            {isRequired && <span className="text-danger">&nbsp;*</span>}
          </label>
        )}
        <span style={{ width: "100%" }}></span>
        {action && (
          <span
            className="m-l--xxxs body-text--md color-link"
            style={{ cursor: "pointer" }}
            onClick={action.action}
          >
            {action.name}
          </span>
        )}
      </div>
      <div
        className={classNames(
          "component__input input-number__container p--xs",
          {
            "input-number__container--sm": isSmall,
            "py--xxs": isSmall,
            "px--xs": isSmall,
            "p--xs": !isSmall,
            "input-number--material": type === BORDER_TYPE.MATERIAL,
            "input-number--disabled ": disabled,
            "input-number--float": type === BORDER_TYPE.FLOAT_LABEL,
          }
        )}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {prefix && (
          <>
            {typeof prefix === "string" ? (
              <span className="p-r--xxs">{prefix}</span>
            ) : (
              <div className="m-r--xs input-number__icon">{prefix}</div>
            )}
          </>
        )}
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          placeholder={
            type === BORDER_TYPE.FLOAT_LABEL && label ? " " : placeHolder
          }
          ref={inputRef}
          disabled={disabled}
          className={classNames("component__input", {
            "disabled-field": disabled,
          })}
          min={min}
          max={max}
        />
        {type === BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            className={classNames("component__title", {
              "component__title--normal": !prefix,
              "component__title--prefix": prefix,
              "component__title--sm": isSmall,
            })}
          >
            {label}
            {isRequired && <span className="text-danger">&nbsp;*</span>}
          </label>
        )}
        {internalValue && !disabled && (
          <div style={{ width: "16px", height: "20px" }} className="m-l--xxs">
            <CloseFilled16
              className={classNames("input-icon__clear")}
              onClick={handleClearInput}
            ></CloseFilled16>
          </div>
        )}
        {suffix && (
          <>
            {typeof suffix === "string" ? (
              <span className="body-text--md m-l--xxs">{suffix}</span>
            ) : (
              <div className="m-l--xxs input-text__icon">{suffix}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

InputNumber.defaultProps = {
  label: "",
  type: BORDER_TYPE.BORDERED,
  isSmall: false,
  isRequired: false,
  allowPositive: false,
  isReverseSymb: false,
  numberType: LONG,
  decimalDigit: 4,
  disabled: false,
  prefix: "",
};

export default InputNumber;
