import React from "react";
import { motion } from "framer-motion";

const Loading = ({ rows = 10 }) => {
  const shimmerVariants = {
    animate: {
      x: [-200, 200],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const SkeletonRow = ({ delay = 0 }) => (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="border-b border-gray-100"
    >
      <td className="px-6 py-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-4 w-32">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-4 w-24">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-4 w-40">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-4 w-28">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-4 w-20">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative overflow-hidden bg-gray-200 rounded-md h-6 w-48">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="relative overflow-hidden bg-gray-300 rounded-md h-4 w-16">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="relative overflow-hidden bg-gray-300 rounded-md h-4 w-20">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="relative overflow-hidden bg-gray-300 rounded-md h-4 w-12">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="relative overflow-hidden bg-gray-300 rounded-md h-4 w-14">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="relative overflow-hidden bg-gray-300 rounded-md h-4 w-24">
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <SkeletonRow key={index} delay={index * 0.1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loading;