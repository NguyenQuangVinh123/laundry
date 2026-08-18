"use client";

import { useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { MEMBER_PACKAGES } from "@/lib/member-packages";
import { normalizeForSearch } from "@/lib/utils";

type Member = {
  id: number;
  package: string;
  balance: number;
  expiresAt: string;
  createdAt: string;
  customer: { name: string; phone: string | null };
};

type CustomerOption = { value: number | string; label: string };

const PACKAGE_LABELS: Record<string, string> = {
  INDIVIDUAL: "Cá Nhân",
  FAMILY: "Gia Đình",
  SPA_HOTEL: "Spa/KS",
};

function formatVND(amount: number) {
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

function isExpired(date: string) {
  return new Date(date) < new Date();
}

const filterCustomerOption = (
  option: { label: string; value: number | string },
  inputValue: string
) => {
  if (!inputValue.trim()) return true;
  return normalizeForSearch(option.label).includes(
    normalizeForSearch(inputValue)
  );
};

export default function MemberList({
  members,
  canRegister,
  canManage,
  customers,
}: {
  members: Member[];
  canRegister: boolean;
  canManage: boolean;
  customers: { id: number; name: string }[];
}) {
  const [showRegister, setShowRegister] = useState(false);
  const [search, setSearch] = useState("");
  const [actionTarget, setActionTarget] = useState<{ member: Member; action: "edit" | "recharge" | "delete" } | null>(null);

  const closeAction = () => { setActionTarget(null); };

  const filteredMembers = useMemo(() => {
    const term = search.trim();
    if (!term) return members;

    const nq = normalizeForSearch(term);
    return members.filter((m) => {
      const name = normalizeForSearch(m.customer.name);
      const phone = normalizeForSearch(m.customer.phone ?? "");
      const pkg = normalizeForSearch(PACKAGE_LABELS[m.package] ?? m.package);
      return name.includes(nq) || phone.includes(nq) || pkg.includes(nq);
    });
  }, [members, search]);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {search.trim() ? (
            <>
              Hiển thị <span className="font-semibold">{filteredMembers.length}</span> /{" "}
              {members.length} thành viên
            </>
          ) : (
            <>
              Tổng: <span className="font-semibold">{members.length}</span> thành viên
            </>
          )}
        </p>
        {canRegister && (
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 shrink-0"
          >
            {showRegister ? "Đóng" : "+ Đăng ký gói"}
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          placeholder="Tìm theo tên, SĐT hoặc gói..."
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Register Form */}
      {canRegister && showRegister && (
        <RegisterForm onClose={() => setShowRegister(false)} customers={customers} />
      )}

      {/* Action Modal */}
      {actionTarget && (
        <ActionModal
          member={actionTarget.member}
          action={actionTarget.action}
          onClose={closeAction}
        />
      )}

      {/* Members Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-pink-400 to-pink-500 text-white">
            <tr>
              <th className="px-3 py-3 text-left">Khách hàng</th>
              <th className="px-3 py-3 text-center">Gói</th>
              <th className="px-3 py-3 text-right">Số dư</th>
              <th className="px-3 py-3 text-center">Trạng thái</th>
              {canManage && <th className="px-3 py-3 text-center">Hành động</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {members.length === 0 && (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="px-3 py-8 text-center text-gray-400">
                  Chưa có thành viên nào
                </td>
              </tr>
            )}
            {members.length > 0 && filteredMembers.length === 0 && (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="px-3 py-8 text-center text-gray-400">
                  Không tìm thấy thành viên phù hợp
                </td>
              </tr>
            )}
            {filteredMembers.map((m) => {
              const expired = isExpired(m.expiresAt);
              return (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-gray-800">{m.customer.name}</p>
                    {m.customer.phone && (
                      <p className="text-xs text-gray-400">{m.customer.phone}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {PACKAGE_LABELS[m.package] ?? m.package}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-green-600">
                    {formatVND(m.balance)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {expired || m.balance <= 0 ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                        {expired ? "Hết hạn" : "Hết dư"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setActionTarget({ member: m, action: "recharge" })}
                          className="rounded p-1 text-green-600 hover:bg-green-50"
                          title="Nạp thêm"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                        <button
                          onClick={() => setActionTarget({ member: m, action: "edit" })}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                          title="Sửa gói"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={() => setActionTarget({ member: m, action: "delete" })}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Xóa"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Action Modal (Edit / Recharge / Delete) ── */

function ActionModal({ member, action, onClose }: {
  member: Member;
  action: "edit" | "recharge" | "delete";
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedPkg, setSelectedPkg] = useState(member.package as "INDIVIDUAL" | "FAMILY" | "SPA_HOTEL");

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      let res: Response;

      if (action === "recharge") {
        res = await fetch(`/api/members/${member.id}/recharge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: member.id, amount: Number(rechargeAmount) }),
        });
      } else if (action === "edit") {
        res = await fetch(`/api/members/${member.id}/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: member.id, package: selectedPkg }),
        });
      } else {
        res = await fetch(`/api/members/${member.id}?memberId=${member.id}`, {
          method: "DELETE",
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || "Lỗi" });
      } else {
        setResult({ success: true });
        setTimeout(() => window.location.reload(), 800);
      }
    } catch {
      setResult({ error: "Không kết nối được server." });
    } finally {
      setLoading(false);
    }
  };

  const config = MEMBER_PACKAGES.find((p) => p.key === selectedPkg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {action === "recharge" && `Nạp thêm — ${member.customer.name}`}
          {action === "edit" && `Sửa gói — ${member.customer.name}`}
          {action === "delete" && `Xóa thành viên — ${member.customer.name}`}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Số dư hiện tại: <strong className="text-green-600">{formatVND(member.balance)}</strong>
        </p>

        {/* Recharge */}
        {action === "recharge" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Số tiền nạp (nghìn)</label>
            <input
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="VD: 300"
            />
          </div>
        )}

        {/* Edit */}
        {action === "edit" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Chuyển sang gói</label>
            <select
              value={selectedPkg}
              onChange={(e) => setSelectedPkg(e.target.value as typeof selectedPkg)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {MEMBER_PACKAGES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label} — Nạp {p.deposit}K → {p.bonus}K ({p.validityDays} ngày)
                </option>
              ))}
            </select>
            {config && (
              <p className="mt-2 text-xs text-gray-500">
                Số dư sẽ được set thành <strong className="text-green-600">{config.bonus}K</strong>,
                hạn <strong>{config.validityDays} ngày</strong> từ hôm nay.
              </p>
            )}
          </div>
        )}

        {/* Delete */}
        {action === "delete" && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            Bạn có chắc muốn xóa tài khoản thành viên của <strong>{member.customer.name}</strong>?
            Hành động này không thể hoàn tác.
          </p>
        )}

        {result?.error && <p className="mt-3 text-sm text-red-500">{result.error}</p>}
        {result?.success && <p className="mt-3 text-sm text-green-600">Thành công! Đang tải lại...</p>}

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (action === "recharge" && !rechargeAmount)}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              action === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Đang xử lý..." : action === "recharge" ? "Nạp" : action === "edit" ? "Cập nhật" : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Register Form ── */

function RegisterForm({
  onClose,
  customers,
}: {
  onClose: () => void;
  customers: { id: number; name: string }[];
}) {
  const [customerId, setCustomerId] = useState("");
  const [selectedPkg, setSelectedPkg] = useState(MEMBER_PACKAGES[0].key);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  const config = MEMBER_PACKAGES.find((p) => p.key === selectedPkg)!;
  const mappingCustomer = useMemo<CustomerOption[]>(
    () =>
      customers
        .map((i) => ({ value: i.id, label: i.name }))
        .sort((a, b) => a.label.localeCompare(b.label, "vi")),
    [customers]
  );

  const handleSubmit = async () => {
    if (!customerId.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const asId = Number(customerId);
      const payload = {
        customerId: Number.isNaN(asId) || asId <= 0 ? customerId.trim() : asId,
        package: selectedPkg,
      };
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || "Lỗi" });
      } else {
        setResult({ success: true });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch {
      setResult({ error: "Không kết nối được server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-pink-200 bg-pink-50 p-4">
      <h3 className="mb-3 font-semibold text-pink-800">Đăng ký gói thành viên</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Khách hàng
          </label>
          <CreatableSelect
            onChange={(e) => setCustomerId(e ? String(e.value) : "")}
            options={mappingCustomer}
            isClearable
            placeholder="Gõ tên khách để tìm…"
            noOptionsMessage={() => "Không thấy — Enter để tạo khách mới"}
            formatCreateLabel={(input) => `Tạo khách: "${input}"`}
            filterOption={filterCustomerOption}
            className="text-sm"
            classNamePrefix="customer-select"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Chọn gói
          </label>
          <select
            value={selectedPkg}
            onChange={(e) => setSelectedPkg(e.target.value as typeof selectedPkg)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {MEMBER_PACKAGES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label} — Nạp {p.deposit}K → {p.bonus}K ({p.validityDays} ngày)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-white p-3 text-sm">
        <p>
          Nạp <strong>{config.deposit}K</strong> → Nhận{" "}
          <strong className="text-green-600">{config.bonus}K</strong> số dư
          (tặng <strong>{config.extra}K</strong>) · Hạn {config.validityDays} ngày
        </p>
        <p className="text-xs text-gray-400 mt-1">{config.description}</p>
      </div>

      {result?.error && <p className="mt-2 text-sm text-red-500">{result.error}</p>}
      {result?.success && <p className="mt-2 text-sm text-green-600">Đăng ký thành công! Đang tải lại...</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !customerId.trim()}
          className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
