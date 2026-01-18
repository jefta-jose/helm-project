{{- define "postgres-db.name" -}}
postgres-db
{{- end }}

{{- define "postgres-db.fullname" -}}
{{ .Release.Name }}-{{ include "postgres-db.name" . }}
{{- end }}

{{- define "postgres-db.labels" -}}
app.kubernetes.io/name: {{ include "postgres-db.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}