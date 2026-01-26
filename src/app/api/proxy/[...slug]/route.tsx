import { proxyHandler } from "@/lib/api/apiHandler/proxyHandler"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}

export async function HEAD(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
    return proxyHandler(req, { params })
}
