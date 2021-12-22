import React, { RefObject } from "react";
import "./DatePicker.scss";
import { DatePicker as DatePickerAntd } from "antd";
import { Moment } from "moment";

import classNames from "classnames";
import { DatePickerProps as AntdDatePickerProps } from "antd/lib/date-picker";
import { DEFAULT_DATETIME_VALUE } from "config/consts";
import { CommonService } from "services/common-service";
import { Subscription } from "rxjs";
import { BORDER_TYPE } from "config/enum";

interface DatePickerAction {
  name?: string;
  action?: any;
}
interface DatePickerProps {
  value?: Moment;
  label?: string;
  isMaterial?: boolean;
  dateFormat?: string[];
  error?: string;
  onChange?: (value: Moment | null, dateString?: string) => void;
  type?: BORDER_TYPE;
  isSmall?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
  className?: string;
  action?: DatePickerAction;
  placeHolder?: string;
}

function DatePicker(props: DatePickerProps & AntdDatePickerProps) {
  const {
    value,
    dateFormat,
    onChange,
    className,
    type,
    label,
    isRequired,
    action,
    isSmall,
    disabled,
    placeHolder,
  } = props;

  const dateRef = React.useRef<any>();
  const wrapperRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(
    null
  );
  const internalValue = React.useMemo(() => {
    return typeof value === "string"
      ? CommonService.toMomentDate(value)
      : value;
  }, [value]);


  const handleClearDate = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const handleOpenChange = React.useCallback(
    (event) => {
      if (event) {
        if (type === BORDER_TYPE.FLOAT_LABEL) {
          const element = document.getElementById("component__title-id");
          if (element) {
            element.classList.add('component__title-up');
            element.classList.remove('component__title-down');
          }
        }
      } else {
        if (!internalValue) {
          const element = document.getElementById("component__title-id");
          if (element) {
            element.classList.add('component__title-down');
            element.classList.remove('component__title-up');
          }
        }
      }
    },
    [internalValue, type]
  );

  React.useEffect(() => {
    const subscription = new Subscription();
    if (internalValue) {
      const element = document.getElementById("component__title-id");
      if (element) {
        element.classList.add('component__title-up');
        element.classList.remove('component__title-down');
      }
    }
    return function cleanup() {
      subscription.unsubscribe();
    };
  }, [internalValue]);




  return (
    <div className={classNames("date-picker__wrapper", className)} ref={wrapperRef}>
      <div className="date-picker__label m-b--xxxs">
        {type !== BORDER_TYPE.FLOAT_LABEL && label && (
          <label className="component__title">
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

      <DatePickerAntd
        {...props}
        value={internalValue}
        style={{ width: "100%" }}
        ref={dateRef}
        allowClear={false}
        format={dateFormat}
        onOpenChange={handleOpenChange}
        className={classNames("bg-white", {
          "date-picker__wrapper--sm": isSmall,
          "p-y--xxs": isSmall,
          "p-x--xs": isSmall,
          "p--xs": !isSmall,
          "date-picker--material": type === BORDER_TYPE.MATERIAL,
          "date-picker--disabled ": disabled,
          "date-picker--float": type === BORDER_TYPE.FLOAT_LABEL,
        })}
        placeholder={
          type === BORDER_TYPE.FLOAT_LABEL && label ? " " : placeHolder
        }

      />
      {type === BORDER_TYPE.FLOAT_LABEL && label && (
        <label
          id="component__title-id"
          className={classNames("component__title component__title--normal", {
            "component__title--sm": isSmall,
            "component__title-up": internalValue,
          })}
          onClick={handleOpenChange}

        >
          {label}
          {isRequired && <span className="text-danger">&nbsp;*</span>}
        </label>
      )}
      {value && String(value) !== DEFAULT_DATETIME_VALUE && (
        <span
          className={classNames("date-picker__icon-wrapper", {
            "date-picker__icon-wrapper--material":
              type === BORDER_TYPE.MATERIAL,
          })}
        >
          <i
            className={classNames(
              "input-icon__clear",
              "m-l--xxs",
              "tio-clear_circle"
            )}
            onClick={handleClearDate}
          ></i>
        </span>
      )}
    </div>
  );
}
DatePicker.defaultProps = {
  isMaterial: false,
  dateFormat: ["DD/MM/YYYY", "YYYY/MM/DD"],
  label: "",
  isSmall: false,
  type: BORDER_TYPE.BORDERED,
  isRequired: false,
  disabled: false,
  className: "",
};

export default DatePicker;
