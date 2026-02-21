"use client";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export const SelectWithRef = React.forwardRef((props: any, ref: React.Ref<any>) => (
  <Select {...props}>
    <SelectTrigger>
      <SelectValue ref={ref} placeholder="Selecione a categoria" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{props.label}</SelectLabel>
        {props.options?.map((option: any) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.title}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
));

SelectWithRef.displayName = "Select";
