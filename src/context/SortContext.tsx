"use client";

import { set } from "date-fns";
import React, { createContext, useContext, useState, ReactNode, SetStateAction } from "react";

interface SortContextProps {
  sortValue: string;
  newSortValue: string;
  sortDirection: { [key: string]: "ASC" | "DESC" };
  newSortDirection: string;
  handleSortValue: (column: string) => void;
  deleteValues: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems?: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
      totalItems: number;
    }>
  >;
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;
  category: string | undefined;
  setCategory: (category: string | undefined) => void;
  updateKey:
    | {
        key: string | undefined;
        type: string;
        limit?: number;
        period?: string;
      }
    | undefined;
  setUpdateKey: (
    value:
      | {
          key: string | undefined;
          type: string;
          limit?: number;
          period?: string;
        }
      | undefined
  ) => void;
  date: string | undefined;
  setDate: (date: string | undefined) => void;
  startAndEndDate: {
    startDate: string;
    endDate: string;
  };
  setStartAndEndDate: React.Dispatch<
    SetStateAction<{
      startDate: string;
      endDate: string;
    }>
  >;
  resetPagination: () => void;
}

const SortContext = createContext<SortContextProps | undefined>(undefined);

export const SortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortValue, setSortValue] = useState<string>("");
  const [updateKey, setUpdateKey] = useState<
    { key: string | undefined; type: string; limit?: number; period?: string } | undefined
  >(undefined);
  const [newSortValue, setNewSortValue] = useState<string>("");
  const [newSortDirection, setNewSortDirection] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<{
    [key: string]: "ASC" | "DESC";
  }>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, totalItems: 0 });
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("");

  const resetPagination = () => {
    setPagination({ pageIndex: 0, pageSize: 10, totalItems: 0 });
  };

  const [startAndEndDate, setStartAndEndDate] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });
  const handleSortValue = (column: string) => {
    const currentDirection = sortDirection[column];
    const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
    setSortDirection({ ...sortDirection, [column]: newDirection });
    setSortValue(`${column},${newDirection}`);
    setNewSortValue(`${column}`);
    setNewSortDirection(newDirection);
  };

  const deleteValues = () => {
    setSortValue("");
    setNewSortValue("");
    setNewSortDirection("");
    setTitle("");
    setStartAndEndDate({ startDate: "", endDate: "" });
    setCategory(undefined);
    setSortDirection({});
    setUpdateKey(undefined);
    setPagination({ pageIndex: 0, pageSize: 10, totalItems: 0 });
  };

  return (
    <SortContext.Provider
      value={{
        sortValue,
        sortDirection,
        handleSortValue,
        deleteValues,
        newSortValue,
        newSortDirection,
        pagination,
        setPagination,
        resetPagination,
        category,
        setCategory,
        title,
        setTitle,
        updateKey,
        setUpdateKey: (value: { key: string | undefined; type: string; limit?: number; period?: string } | undefined) =>
          setUpdateKey(value),
        startAndEndDate,
        setStartAndEndDate,
        date,
        setDate: (date: string | undefined) => setDate(date),
      }}
    >
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
};
