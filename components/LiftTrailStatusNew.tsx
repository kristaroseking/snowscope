"use client";

import { useState } from "react";
import { LiveLiftStatus, LiveTrailStatus, ResortStatus } from "@/types";

interface LiftTrailStatusProps {
  status: ResortStatus;
}

export default function LiftTrailStatusNew({ status }: LiftTrailStatusProps) {
  const [liftsExpanded, setLiftsExpanded] = useState(true);
  const [trailsExpanded, setTrailsExpanded] = useState(true);

  // Sort lifts: open first, then closed
  const sortedLifts = [...status.lifts].sort((a, b) => {
    if (a.status === "Open" && b.status !== "Open") return -1;
    if (a.status !== "Open" && b.status === "Open") return 1;
    return a.name.localeCompare(b.name);
  });

  // Sort trails: open first, then closed
  const sortedTrails = [...status.trails].sort((a, b) => {
    if (a.status === "Open" && b.status !== "Open") return -1;
    if (a.status !== "Open" && b.status === "Open") return 1;
    return a.name.localeCompare(b.name);
  });

  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case "Green Circle":
        return { icon: "●", color: "text-green-400" };
      case "Blue Square":
        return { icon: "■", color: "text-blue-400" };
      case "Black Diamond":
        return { icon: "◆", color: "text-gray-200" };
      case "Double Black Diamond":
        return { icon: "◆◆", color: "text-gray-200" };
      case "Terrain Park":
        return { icon: "▲", color: "text-orange-400" };
      case "Glades":
        return { icon: "🌲", color: "text-green-600" };
      default:
        return { icon: "●", color: "text-slate-400" };
    }
  };

  return (
    <div className="mb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Trails Open */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="text-sm text-slate-400 uppercase tracking-wide mb-2">
            Trails Open
          </div>
          <div className="text-3xl font-bold text-white">
            {status.stats.trailsOpen}
            <span className="text-xl text-slate-400"> / {status.stats.trailsTotal}</span>
          </div>
        </div>

        {/* Base Depth */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="text-sm text-slate-400 uppercase tracking-wide mb-2">
            Base Depth
          </div>
          <div className="text-3xl font-bold text-white">
            {status.stats.baseDepth}"
          </div>
        </div>

        {/* Season Total */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="text-sm text-slate-400 uppercase tracking-wide mb-2">
            Season Total
          </div>
          <div className="text-3xl font-bold text-white">
            {status.stats.seasonTotal}"
          </div>
        </div>
      </div>

      {/* Lifts Dropdown */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 mb-4">
        <button
          onClick={() => setLiftsExpanded(!liftsExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${liftsExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="text-lg font-semibold text-white">
              Lifts ({status.stats.liftsOpen} / {status.stats.liftsTotal} Open)
            </h3>
          </div>
        </button>

        {liftsExpanded && (
          <div className="px-5 pb-4">
            <div className="space-y-2">
              {sortedLifts.map((lift, index) => {
                const isOpen = lift.status === "Open";
                const statusColor = isOpen ? "bg-green-500" : "bg-red-500";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-slate-750 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm mb-1">
                        {lift.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {lift.type}
                        {lift.rideTime && ` • ${lift.rideTime} min`}
                        {lift.verticalRise && ` • ${lift.verticalRise.toLocaleString()} ft`}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${statusColor} ml-4 flex-shrink-0`}
                      title={lift.status}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Trails Dropdown */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <button
          onClick={() => setTrailsExpanded(!trailsExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${trailsExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="text-lg font-semibold text-white">
              Trails ({status.stats.trailsOpen} / {status.stats.trailsTotal} Open)
            </h3>
          </div>
        </button>

        {trailsExpanded && (
          <div className="px-5 pb-4">
            <div className="space-y-2">
              {sortedTrails.map((trail, index) => {
                const isOpen = trail.status === "Open";
                const statusColor = isOpen ? "bg-green-500" : "bg-red-500";
                const difficultyDisplay = getDifficultyDisplay(trail.difficulty);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-slate-750 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`text-xl ${difficultyDisplay.color}`}>
                        {difficultyDisplay.icon}
                      </span>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {trail.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {trail.difficulty}
                          {trail.groomed && " • Groomed"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${statusColor} ml-4 flex-shrink-0`}
                      title={trail.status}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-slate-500 text-center italic">
        Last updated: {new Date(status.stats.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
